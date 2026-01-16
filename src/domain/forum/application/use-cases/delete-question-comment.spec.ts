import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/error/not-allowed-error';

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository;
// system in memory test
let sut: DeleteQuestionCommentUseCase;

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository();

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionsCommentsRepository);
  });

  it('should be able to delete one question', async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionsCommentsRepository.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionsCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    });

    await inMemoryQuestionsCommentsRepository.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
