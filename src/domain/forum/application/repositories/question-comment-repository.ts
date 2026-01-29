import { PaginationParams } from '@/core/shared/pagination-params';
import { QuestionComment } from '../../enterprise/entities/question-comment';

export abstract class QuestionCommentRepository {
  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>;
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
}
