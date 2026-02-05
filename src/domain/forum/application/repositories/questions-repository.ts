import { PaginationParams } from '@/core/shared/pagination-params';
import { Question } from '../../enterprise/entities/question';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract findById(id: string): Promise<Question | null>;
  abstract delete(questionId: string): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
}
