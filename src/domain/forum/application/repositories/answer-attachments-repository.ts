import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

export abstract class AnswerAttachmentsRepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  abstract deleteByAnswerId(answerId: string): Promise<void>;
}
