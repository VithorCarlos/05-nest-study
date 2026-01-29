import { Either, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { Injectable } from '@nestjs/common';

interface FetchQuestionsCommentsRequest {
  page: number;
  questionId: string;
}

type FetchQuestionsCommentsResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;
@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionsCommentsRequest): Promise<FetchQuestionsCommentsResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({ questionComments });
  }
}
