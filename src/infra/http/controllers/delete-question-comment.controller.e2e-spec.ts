import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/make-student.js';
import { DatabaseModule } from '@/infra/database/database.module.js';
import type { PrismaService } from '@/infra/database/prisma/prisma.service.js';
import { QuestionFactory } from 'test/factories/make-questions.js';
import { QuestionCommentsFacotry } from 'test/factories/make-question-comment.js';

describe('Delete Question Comment (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionCommentsFactory: QuestionCommentsFacotry;
  let questionFactory: QuestionFactory;

  let prisma: PrismaService;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../../app.module.js');
    const { PrismaService } =
      await import('../../database/prisma/prisma.service.js');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentsFacotry],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentsFactory = moduleRef.get(QuestionCommentsFacotry);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionComment = await questionCommentsFactory.makePrismaQuestion({
      authorId: user.id,
      questionId: question.id,
    });

    const questionCommentId = questionComment.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const questionCommentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    });

    expect(questionCommentOnDatabase).toBeNull();
  });
});
