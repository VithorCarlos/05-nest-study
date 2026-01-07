import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth-guard';
import { UserPayload } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import z from 'zod';

const createQuestionControllerSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidator = new ZodValidationPipe(createQuestionControllerSchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionControllerSchema>;

@Controller()
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post('questions')
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidator) body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body;
    const userId = user.sub;
    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    });
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
