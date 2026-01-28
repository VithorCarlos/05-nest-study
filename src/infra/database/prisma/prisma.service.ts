import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: EnvService) {
    const databaseUrl = config.get('DATABASE_URL');
    const databaseSchema = config.get('DATABASE_SCHEMA');

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
