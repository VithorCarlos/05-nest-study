import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { StudentFacotry } from 'test/factories/make-student.js';
import { QuestionFacotry } from 'test/factories/make-questions.js';
import { DatabaseModule } from '@/infra/database/database.module.js';

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFacotry;
  let questionFactory: QuestionFacotry;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../../app.module.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFacotry, QuestionFacotry],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFacotry);
    questionFactory = moduleRef.get(QuestionFacotry);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 01',
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'Content Of Question',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
      ],
    });
  });
});
