import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created';
import { OnQuestionAnswerBestChosen } from '@/domain/notification/application/subscribers/on-question-best-chosen';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionAnswerBestChosen,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
