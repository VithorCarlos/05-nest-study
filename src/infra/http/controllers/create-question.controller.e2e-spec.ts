import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { StudentFacotry } from 'test/factories/make-student.js';
import { DatabaseModule } from '@/infra/database/database.module.js';
import type { PrismaService } from '@/infra/database/prisma/prisma.service.js';

describe('Create Questions (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFacotry;
  let prisma: PrismaService;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../../app.module.js');
    const { PrismaService } =
      await import('../../database/prisma/prisma.service.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFacotry],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFacotry);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

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
