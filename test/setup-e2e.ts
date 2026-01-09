import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const schemaId = randomUUID();
let prisma: PrismaClient;

function gerenateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide unique DATABASE_URL enviroment variable');
  }

  const url = new URL(process.env.DATABASE_URL);
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

  execSync('pnpm prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  const teste = await prisma.$executeRaw`SELECT current_schema();`;
  await prisma.$disconnect();
});
