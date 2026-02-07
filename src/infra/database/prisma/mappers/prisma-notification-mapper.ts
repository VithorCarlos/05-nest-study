import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import {
  Notification as PrismaNotification,
  Prisma,
} from 'generated/prisma/client';

//mapper is responsible to convert an layer format to layer format
export class PrismaNotificationMapper {
  //prisma to domain
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        readAt: raw.readAt,
        recipientId: new UniqueEntityId(raw.recipientId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  //domain to prisma
  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      recipientId: notification.recipientId.toString(),
      createdAt: notification.createdAt,
    };
  }
}
