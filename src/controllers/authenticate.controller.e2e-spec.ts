import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { PrismaService } from '@/prisma/prisma.service.js';
import { hash } from 'bcryptjs';

describe('Autenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../app.module.js');
    const { PrismaService } = await import('../prisma/prisma.service.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
