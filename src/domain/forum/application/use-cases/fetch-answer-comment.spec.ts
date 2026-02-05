import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comments';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;

let inMemoryAnswerCommentRepository: InMemoryAnswersCommentsRepository;
// system in memory test
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer awnsers', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentRepository = new InMemoryAnswersCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository);
  });

  it('should be able to fetch answers comments', async () => {
    const student = makeStudent({ name: 'john doe' });
    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    });

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    });

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    });

    await inMemoryAnswerCommentRepository.create(comment1);
    await inMemoryAnswerCommentRepository.create(comment2);
    await inMemoryAnswerCommentRepository.create(comment3);

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);

    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'john doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'john doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'john doe',
          commentId: comment3.id,
        }),
      ]),
    );
  });

  it('should be able to fetch paginated answers comments', async () => {
    const student = makeStudent({ name: 'john doe' });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
