import { Either, right } from '@/core/either';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface FetchQuestionsCommentsRequest {
  page: number;
  questionId: string;
}

type FetchQuestionsCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;
@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionsCommentsRequest): Promise<FetchQuestionsCommentsResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      );

    return right({ comments });
  }
}
