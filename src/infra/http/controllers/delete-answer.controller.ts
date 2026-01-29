import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswersUseCase } from '@/domain/forum/application/use-cases/delete-answer';

@Controller()
export class DeleteAnswerController {
  constructor(private deleteAnswers: DeleteAnswersUseCase) {}

  @Delete('/answers/:id')
  @HttpCode(204)
  async handle(
    @Param('id') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;
    const result = await this.deleteAnswers.execute({
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
