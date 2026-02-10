import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/make-student.js';
import { DatabaseModule } from '@/infra/database/database.module.js';
import { NotificationFactory } from 'test/factories/make-notification.js';
import type { PrismaService } from '@/infra/database/prisma/prisma.service.js';

describe('Read notification (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let prisma: PrismaService;

  let notificationFactory: NotificationFactory;

  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../../app.module.js');
    const { PrismaService } =
      await import('../../database/prisma/prisma.service.js');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'john doe',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: { recipientId: user.id.toString() },
    });

    expect(notificationOnDatabase?.readAt).not.toBeNull();
  });
});
