import { PaginationParams } from '@/core/shared/pagination-params';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper';
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper';

@Injectable()
export class PrismaQuestionCommentRepository implements QuestionCommentRepository {
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prisma.comment.create({ data });
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const PER_PAGE = 20;

    const questionComments = await this.prisma.comment.findMany({
      where: { questionId },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const PER_PAGE = 20;

    const questionComments = await this.prisma.comment.findMany({
      where: { questionId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    });

    return questionComments.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!questionComment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    });
  }
}
