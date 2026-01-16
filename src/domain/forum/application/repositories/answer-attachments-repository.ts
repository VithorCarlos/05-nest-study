import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  deleteByAnswerId(answerId: string): Promise<void>;
}
