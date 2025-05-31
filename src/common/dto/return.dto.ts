/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateReturnDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  orderId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productItemId: string;
}

export class UpdateReturnDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trackingStatus: string;
}
