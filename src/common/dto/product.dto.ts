/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  offer_price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  details: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  top_points: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];
}

export class EditProductDto extends PartialType(CreateProductDto) {}
