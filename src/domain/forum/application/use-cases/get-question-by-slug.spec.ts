import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

import { GetQuestionBySlugUseCase } from './get-question-by-slug';

import { makeQuestion } from 'test/factories/make-questions';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;

// system in memory test
let sut: GetQuestionBySlugUseCase;

describe('Create question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('title-a-new-question'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: 'title-a-new-question',
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({ title: newQuestion.title }),
    });
  });

  it('should not be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('title-a-new-question'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: 'title-a-new-question-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
