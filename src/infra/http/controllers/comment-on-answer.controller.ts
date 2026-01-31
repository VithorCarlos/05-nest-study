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
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';

const commentOnAnswerControllerSchema = z.object({
  content: z.string(),
});

const bodyValidator = new ZodValidationPipe(commentOnAnswerControllerSchema);

type CommentOnAnswerBodySchema = z.infer<
  typeof commentOnAnswerControllerSchema
>;

@Controller()
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post('/answers/:answerId/comments')
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidator) body: CommentOnAnswerBodySchema,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
