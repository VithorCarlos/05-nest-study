import { Either, right, left } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students-repository';
import { HashGenerator } from '../../cryptography/hash-generator';
import { StudentAlreadyExistsError } from './errors/student-already-exists';
import { Student } from '../../enterprise/entities/student';

interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    const userWithSameEmail = await this.studentsRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({ name, email, password: hashedPassword });

    await this.studentsRepository.create(student);

    return right({ student });
  }
}
