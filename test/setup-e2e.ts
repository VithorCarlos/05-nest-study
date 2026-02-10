import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { DomainEvents } from '@/core/events/domain-events';
import { Redis } from 'ioredis';
import { envSchema } from '@/infra/env/env';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const schemaId = randomUUID();
let prisma: PrismaClient;

const env = envSchema.parse(process.env);

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
  password: env.REDIS_PASSWORD,
});

function gerenateUniqueDatabaseUrl(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide unique DATABASE_URL enviroment variable');
  }

  const url = new URL(env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  return url.toString();
}

beforeAll(async () => {
  const databaseURL = gerenateUniqueDatabaseUrl(schemaId);

  process.env.DATABASE_URL = databaseURL;
  process.env.DATABASE_SCHEMA = schemaId;

  const adapter = new PrismaPg({ connectionString: databaseURL });

  prisma = new PrismaClient({
    adapter,
  });

  DomainEvents.shouldRun = false;

  await redis.flushdb();

  execSync('pnpm prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
