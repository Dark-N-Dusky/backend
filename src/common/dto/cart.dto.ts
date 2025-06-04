/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CartItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  quantity: number;
}

export class EditCartItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  quantity?: number;
}

export class CheckoutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  quantity?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  address_id: string;
}
