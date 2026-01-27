import { UseCaseError } from '@/core/errors/use-case.error';

export class WorngCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Credentials are not valid');
  }
}
