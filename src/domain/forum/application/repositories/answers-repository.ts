import { PaginationParams } from '@/core/shared/pagination-params';
import { Answer } from '../../enterprise/entities/answer';

export interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  save(answer: Answer): Promise<void>;
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  delete(answerId: string): Promise<void>;
}
