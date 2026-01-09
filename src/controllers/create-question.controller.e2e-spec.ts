import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { PrismaService } from '@/prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

describe('Create Questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../app.module.js');
    const { PrismaService } = await import('../prisma/prisma.service.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'Content Of Question',
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.question.findUnique({
      where: {
        slug: 'new-question',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
