import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post('questions')
  async handle() {
    return 'ok';
  }
}
