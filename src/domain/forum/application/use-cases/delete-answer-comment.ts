import { Either, left, right } from '@/core/either';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/error/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface DeleteAnswerCommentRequest {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answersCommentRepository: AnswerCommentRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment =
      await this.answersCommentRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answersCommentRepository.delete(answerComment);

    return right(null);
  }
}
