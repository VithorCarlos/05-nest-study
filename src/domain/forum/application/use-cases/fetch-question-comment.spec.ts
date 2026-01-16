import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';

let inMemoryQuestionCommentRepository: InMemoryQuestionsCommentsRepository;
// system in memory test
let sut: FetchQuestionCommentsUseCase;

describe('Fetch question awnsers', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository =
      new InMemoryQuestionsCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository);
  });

  it('should be able to fetch questions comments', async () => {
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it('should be able to fetch paginated questions comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
