import { Either, left, right } from '@/core/either';
import { Notification } from '../../enterprise/entities/notification';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { ResourceNotFoundError } from '@/core/errors/error/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/error/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface ReadNotificationRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}
