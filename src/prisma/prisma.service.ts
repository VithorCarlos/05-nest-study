import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/env';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(ConfigService)
    config: ConfigService<Env, true>,
  ) {
    const databaseUrl = config.get('DATABASE_URL', { infer: true });
    const databaseSchema = config.get('DATABASE_SCHEMA', { infer: true });

    const adapter = new PrismaPg(
      { connectionString: databaseUrl },
      { schema: databaseSchema },
    );

    super({ adapter, log: ['error', 'warn'] });
  }

  // é oque acontece quando esse modulo do next for instanciado ou destruído
  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}
