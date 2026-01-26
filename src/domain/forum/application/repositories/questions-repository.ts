import { PaginationParams } from '@/core/shared/pagination-params';
import { Question } from '../../enterprise/entities/question';

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract findById(id: string): Promise<Question | null>;
  abstract delete(questionId: string): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
}
