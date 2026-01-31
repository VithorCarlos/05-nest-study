import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/make-student.js';
import { DatabaseModule } from '@/infra/database/database.module.js';
import type { PrismaService } from '@/infra/database/prisma/prisma.service.js';
import { AnswerCommentsFacotry } from 'test/factories/make-answer-comments.js';
import { AnswerFactory } from 'test/factories/make-answer.js';
import { QuestionFactory } from 'test/factories/make-questions.js';

describe('Delete Answer Comment (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let answerCommentsFactory: AnswerCommentsFacotry;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;

  let prisma: PrismaService;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../../app.module.js');
    const { PrismaService } =
      await import('../../database/prisma/prisma.service.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        QuestionFactory,
        AnswerCommentsFacotry,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerCommentsFactory = moduleRef.get(AnswerCommentsFacotry);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    const answerComment = await answerCommentsFactory.makePrismaAnswer({
      authorId: user.id,
      answerId: answer.id,
    });

    const answerCommentId = answerComment.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const answerCommentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    });

    expect(answerCommentOnDatabase).toBeNull();
  });
});
