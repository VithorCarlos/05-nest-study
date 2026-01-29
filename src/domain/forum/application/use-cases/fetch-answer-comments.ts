import { Either, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';
import { Injectable } from '@nestjs/common';

interface FetchAnswerCommentsRequest {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;
@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({ answerComments });
  }
}
