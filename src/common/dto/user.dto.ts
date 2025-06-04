/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  uid?: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  number: string;

  @ApiPropertyOptional()
  @IsOptional()
  role?: string;
}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  token: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  profile_url?: string;
}

export class UpdateAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  line1: string;

  @ApiProperty()
  @IsNotEmpty()
  line2: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  state: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ?? 'India') as string)
  country?: string = 'India';

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  code: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['work', 'home'])
  type: 'work' | 'home';

  @ApiProperty()
  @IsNotEmpty()
  @IsBooleanString()
  weekend_availability: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  alternate_number?: string;
}
