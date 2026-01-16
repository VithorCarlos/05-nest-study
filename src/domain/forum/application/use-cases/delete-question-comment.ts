import { Either, left, right } from '@/core/either';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/error/not-allowed-error';

interface DeleteQuestionCommentRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionsCommentRepository: QuestionCommentRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentRequest): Promise<DeleteQuestionCommentResponse> {
    const questionComment =
      await this.questionsCommentRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionsCommentRepository.delete(questionComment);

    return right(null);
  }
}
