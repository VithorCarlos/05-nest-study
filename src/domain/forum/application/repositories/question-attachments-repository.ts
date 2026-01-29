import { QuestionAttachment } from '../../enterprise/entities/question-attachment';

export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>;
  abstract deleteByQuestionId(questionId: string): Promise<void>;
}
