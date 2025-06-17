/* eslint-disable prettier/prettier */
import { ApiProperty, PartialType } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
import {
  // ArrayNotEmpty,
  // IsArray,
  IsNotEmpty,
  IsNumber,
  // IsNumberString,
  IsString,
  // IsUrl,
  // ValidateNested,
} from 'class-validator';

// export class GallaryClassDto {
//   @ApiProperty()
//   @IsNotEmpty()
//   @IsUrl()
//   image_url: string;
// }

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // media: string[];

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

  // @ApiProperty()
  // @IsNotEmpty()
  // @ArrayNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => GallaryClassDto)
  // gallery: GallaryClassDto[];
}

export class EditProductDto extends PartialType(CreateProductDto) {}
