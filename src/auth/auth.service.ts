/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  LoginUserDto,
  UpdatePasswordDto,
} from 'src/common/dto/user.dto';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Response } from 'express';
import { MailingService } from 'src/common/util/mailing/mailing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly mailingService: MailingService,
  ) {}

  async login(body: LoginUserDto, @Res() res: Response) {
    const user = await this.userModel.findOne({ email: body.email }).exec();

    if (!user || !user.password) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(body.password, user.password);

    if (!isPasswordMatch) {
      throw new NotFoundException('User not found');
    } else {
      const { uid, name, email, role } = user.toObject();
      const token = await this.jwtService.signAsync({
        uid: user.uid,
        role: user.role,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.setHeader('Authorization', `Bearer ${token}`);

      return res.send({
        message: 'Login successful',
        uid,
        name,
        email,
        role,
        token,
      });
    }
  }

  async register(body: CreateUserDto, @Res() res: Response) {
    const oldUser = await this.userModel.findOne({ email: body.email }).exec();

    if (!oldUser) {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const newUser = new this.userModel({
        ...body,
        password: hashedPassword,
        uid: uuidv4(),
      });

      await newUser.save();
      await this.mailingService.sendWelcomeMail(newUser.email, newUser.name);

      const { uid, name, email, role } = newUser.toObject();
      const token = await this.jwtService.signAsync({
        uid: newUser.uid,
        role: newUser.role,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.setHeader('Authorization', `Bearer ${token}`);

      return res.send({
        message: 'User created successfully',
        uid,
        name,
        email,
        role,
        token,
      });
    } else {
      throw new ConflictException('Email already exists');
    }
  }

  logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
    });
    return res.send({ message: 'Logout Successful' });
  }

  async forgotPassword(body: string) {
    const user = await this.userModel.findOne({ email: body }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.jwtService.signAsync({
      uid: user.uid,
      email: user.email,
      type: 'password-reset',
      timestamp: new Date().toISOString(),
    });

    await this.mailingService.sendPasswordResetMail(
      user.email,
      token,
      user.name,
    );

    return {
      message: 'Token sent to email',
      token,
    };
  }

  async resetPassword(body: UpdatePasswordDto) {
    const decodedToken: {
      id: string;
      email: string;
      type: string;
      timestampt: string;
    } = await this.jwtService.verifyAsync(body.token);

    if (decodedToken.type !== 'password-reset') {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userModel
      .findOne({ email: decodedToken.email })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    user.password = hashedPassword;
    await user.save();

    return 'Password updated successfully';
  }

  async validateGoogleUser(googleUser: {
    email: string;
    name: string;
    googleId: string;
    picture: string;
  }) {
    const { email, name, googleId, picture } = googleUser;

    let user = await this.userModel.findOne({ email }).exec();

    if (user) {
      if (!user.google_id) {
        user.google_id = googleId;
        user.auth_type = 'google';
        await user.save();
      }
    } else {
      user = new this.userModel({
        email,
        name,
        google_id: googleId,
        auth_type: 'google',
        uid: uuidv4(),
        profile_url: picture,
        number: '0000000000',
        role: 'user',
        password: '',
      });
      await user.save();

      await this.mailingService.sendWelcomeMail(user.email, user.name);
    }

    return user;
  }

  async generateJwt(user: UserDocument) {
    return this.jwtService.signAsync({
      uid: user.uid,
      role: user.role,
    });
  }
}
