/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdatePasswordDto,
} from 'src/common/dto/user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // 2. Callback Route
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.authService.validateGoogleUser(req.user);
    const token = await this.authService.generateJwt(user);

    // Set Cookie (Same as local login)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // true in production
      maxAge: 24 * 60 * 60 * 1000,
    });

    // REDIRECT to Frontend
    // We pass the token in query param so frontend can save it to localStorage
    // Adjust logic to redirect to your frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(
      `${frontendUrl}/auth/google-success?token=${token}&uid=${user.uid}&name=${user.name}&email=${user.email}&role=${user.role}`,
    );
  }
}
