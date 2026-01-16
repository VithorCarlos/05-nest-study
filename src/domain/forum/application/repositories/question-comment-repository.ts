import { PaginationParams } from '@/core/shared/pagination-params';
import { QuestionComment } from '../../enterprise/entities/question-comment';

export interface QuestionCommentRepository {
  create(questionComment: QuestionComment): Promise<void>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>;
  findById(id: string): Promise<QuestionComment | null>;
  delete(questionComment: QuestionComment): Promise<void>;
}
