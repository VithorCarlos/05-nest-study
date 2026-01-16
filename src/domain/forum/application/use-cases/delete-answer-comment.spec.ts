import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-answer-comments';
import { NotAllowedError } from '@/core/errors/error/not-allowed-error';

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository;
// system in memory test
let sut: DeleteAnswerCommentUseCase;

describe('Delete answer comment', () => {
  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository();

    sut = new DeleteAnswerCommentUseCase(inMemoryAnswersCommentsRepository);
  });

  it('should be able to delete one answer', async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswersCommentsRepository.create(answerComment);

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(inMemoryAnswersCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    });

    await inMemoryAnswersCommentsRepository.create(answerComment);

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
