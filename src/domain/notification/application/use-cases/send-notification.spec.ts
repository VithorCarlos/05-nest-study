import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';

import { SendNotificationUseCase } from './send-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

// system in memory test
let sut: SendNotificationUseCase;

describe('Create notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to create a new notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Title a new notification',
      content: 'Describing a new content',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    );
  });
});
