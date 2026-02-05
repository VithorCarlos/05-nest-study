import { Either, right } from '@/core/either';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface FetchAnswerCommentsRequest {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;
@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );
    return right({ comments });
  }
}
