import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/make-student.js';
import { QuestionFactory } from 'test/factories/make-questions.js';
import { DatabaseModule } from '@/infra/database/database.module.js';
import { QuestionCommentsFactory } from 'test/factories/make-question-comment.js';
import { AnswerFactory } from 'test/factories/make-answer.js';
import { AnswerCommentsFactory } from 'test/factories/make-answer-comments.js';

describe('Fetch Answer Comments (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerCommentsFactory: AnswerCommentsFactory;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../../app.module.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        QuestionCommentsFactory,
        AnswerCommentsFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    answerCommentsFactory = moduleRef.get(AnswerCommentsFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    await Promise.all([
      answerCommentsFactory.makePrismaAnswer({
        authorId: user.id,
        answerId: answer.id,
        content: 'Comment 01',
      }),
      answerCommentsFactory.makePrismaAnswer({
        authorId: user.id,
        answerId: answer.id,
        content: 'Comment 02',
      }),
    ]);

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 01' }),
        expect.objectContaining({ content: 'Comment 02' }),
      ]),
    });
  });
});
