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
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';

const editAnswerControllerSchema = z.object({
  content: z.string(),
});

const bodyValidator = new ZodValidationPipe(editAnswerControllerSchema);

type EditAnswerBodySchema = z.infer<typeof editAnswerControllerSchema>;

@Controller()
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put('/answers/:id')
  @HttpCode(204)
  async handle(
    @Param('id') answerId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidator) body: EditAnswerBodySchema,
  ) {
    const { content } = body;
    const userId = user.sub;
    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      answerId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
