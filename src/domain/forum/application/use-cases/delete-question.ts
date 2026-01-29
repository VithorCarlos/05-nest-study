import { Either, left, right } from '@/core/either';
import { QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/error/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionRequest {
  questionId: string;
  authorId: string;
}

type DeleteQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(questionId);
    return right(null);
  }
}
