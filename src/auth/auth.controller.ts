/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdatePasswordDto,
} from 'src/common/dto/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginUserDto, @Res() res: Response) {
    return this.authService.login(body, res);
  }

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: UpdatePasswordDto) {
    return this.authService.resetPassword(body);
  }
}
