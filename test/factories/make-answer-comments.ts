import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker';
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId,
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answerComment;
}

@Injectable()
export class AnswerCommentsFacotry {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    });

    return answerComment;
  }
}
