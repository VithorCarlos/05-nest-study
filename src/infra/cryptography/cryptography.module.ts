import { Encrypter } from '@/domain/forum/cryptography/encrypter';
import { Module } from '@nestjs/common';
import { JwtEcrypter } from './jwt-encrypter';
import { HashComparer } from '@/domain/forum/cryptography/hash-comparer';
import { BcryptHasher } from './bcrypt-hasher';
import { HashGenerator } from '@/domain/forum/cryptography/hash-generator';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEcrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
