/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class GallaryClassDto {
  @IsNotEmpty()
  @IsUrl()
  image_url: string;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  media: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  offer_price: number;

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsNumberString()
  top_points: number;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GallaryClassDto)
  gallery: GallaryClassDto[];
}

export class EditProductDto extends PartialType(CreateProductDto) {}
