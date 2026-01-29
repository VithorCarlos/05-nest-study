import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const editQuestionControllerSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidator = new ZodValidationPipe(editQuestionControllerSchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionControllerSchema>;

@Controller()
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put('questions/:id')
  @HttpCode(204)
  async handle(
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidator) body: EditQuestionBodySchema,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      questionId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
