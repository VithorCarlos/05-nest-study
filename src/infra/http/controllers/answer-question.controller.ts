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
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';

const AnswerQuestionControllerSchema = z.object({
  content: z.string(),
});

const bodyValidator = new ZodValidationPipe(AnswerQuestionControllerSchema);

type AnswerQuestionBodySchema = z.infer<typeof AnswerQuestionControllerSchema>;

@Controller()
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post('questions/:questionId/answers')
  async handle(
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidator) body: AnswerQuestionBodySchema,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: userId,

      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
