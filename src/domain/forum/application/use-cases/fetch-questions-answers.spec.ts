import { FetchQuestionsAnswersUseCase } from './fetch-questions-answers';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-anwsers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

// system in memory test
let sut: FetchQuestionsAnswersUseCase;

describe('Fetch question awnsers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new FetchQuestionsAnswersUseCase(inMemoryAnswersRepository);
  });

  it('should be able to fetch questions answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );

    const result = await sut.execute({ questionId: 'question-1', page: 1 });

    expect(result.value?.answers).toHaveLength(3);
  });

  it('should be able to fetch paginated questions answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-1') }),
      );
    }

    const result = await sut.execute({ questionId: 'question-1', page: 2 });

    expect(result.value?.answers).toHaveLength(2);
  });
});
