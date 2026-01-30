import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';

const commentOnQuestionControllerSchema = z.object({
  content: z.string(),
});

const bodyValidator = new ZodValidationPipe(commentOnQuestionControllerSchema);

type CommentOnQuestionBodySchema = z.infer<
  typeof commentOnQuestionControllerSchema
>;

@Controller()
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post('/questions/:questionId/comments')
  async handle(
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidator) body: CommentOnQuestionBodySchema,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
