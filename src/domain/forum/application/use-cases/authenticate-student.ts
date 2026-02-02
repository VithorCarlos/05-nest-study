import { Either, right, left } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WorngCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateStudentRequest {
  email: string;
  password: string;
}

type AuthenticateStudentResponse = Either<
  WorngCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentRequest): Promise<AuthenticateStudentResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WorngCredentialsError());
    }

    const isPassawordValid = await this.hashComparer.compare(
      password,
      student.password,
    );

    if (!isPassawordValid) {
      return left(new WorngCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
