import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student.js';
import { DatabaseModule } from '@/infra/database/database.module.js';
import { QuestionFactory } from 'test/factories/make-questions.js';
import { AttachmentFactory } from 'test/factories/make-attachment.js';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments.js';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let cacheRepository: CacheRepository;
  let questionRepository: QuestionsRepository;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../../../app.module');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    questionRepository = moduleRef.get(QuestionsRepository);

    await app.init();
  });

  it('should cache questions details', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionRepository.findDetailsBySlug(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    if (!cached) {
      throw new Error();
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({ id: questionDetails?.questionId.toString() }),
    );
  });

  it('should return cached questions details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    let cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();

    await questionRepository.findDetailsBySlug(slug);

    cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).not.toBeNull();

    if (!cached) {
      throw new Error();
    }

    const questionDetails = await questionRepository.findDetailsBySlug(slug);

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({ id: questionDetails?.questionId.toString() }),
    );
  });

  it('should reset questions details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionRepository.save(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});
