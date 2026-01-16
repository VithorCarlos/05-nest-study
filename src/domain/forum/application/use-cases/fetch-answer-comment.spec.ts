import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comments';

let inMemoryAnswerCommentRepository: InMemoryAnswersCommentsRepository;
// system in memory test
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer awnsers', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswersCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository);
  });

  it('should be able to fetch answers comments', async () => {
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    );
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    );
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    );

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  it('should be able to fetch paginated answers comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
      );
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    });

    expect(result.value?.answerComments).toHaveLength(2);
  });
});
