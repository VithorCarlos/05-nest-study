import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-questions-attachments-repository';
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
