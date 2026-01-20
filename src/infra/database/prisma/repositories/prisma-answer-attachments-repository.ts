import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  get answerId(): UniqueEntityId {
    throw new Error('Method not implemented.');
  }
  get attachmentId(): UniqueEntityId {
    throw new Error('Method not implemented.');
  }
  protected props: AnswerAttachmentProps;
  get id(): UniqueEntityId {
    throw new Error('Method not implemented.');
  }
  public equals(entity: Entity<unknown>): boolean {
    throw new Error('Method not implemented.');
  }
}
