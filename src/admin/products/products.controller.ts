/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Put,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AdminService } from '../admin.service';
import { EditProductDto, CreateProductDto } from 'src/common/dto/product.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CloudinaryService } from 'src/common/util/cloudinary/cloudinary.service';

@Controller('admin/products')
export class ProductsController {
  constructor(
    private readonly adminService: AdminService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  async createProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: Omit<CreateProductDto, 'media' | 'gallery'>,
  ) {
    try {
      const mediaFiles = files.filter((file) => file.fieldname === 'media');
      const galleryFiles = files.filter((file) => file.fieldname === 'gallery');

      const mediaUrls = (
        await Promise.all(
          mediaFiles.map((file) => this.cloudinaryService.uploadImage(file)),
        )
      ).filter((url): url is string => !!url);

      const galleryUrls = (
        await Promise.all(
          galleryFiles.map((file) => this.cloudinaryService.uploadImage(file)),
        )
      ).filter((url): url is string => !!url);

      // Combine media URLs and gallery URLs
      const allImageUrls = [...mediaUrls, ...galleryUrls];
      const galleryMapped = allImageUrls.map((url) => ({ image_url: url }));

      const dtoObject = {
        ...body,
        media: mediaUrls,
        gallery: galleryMapped,
        top_points: Number(body.top_points),
        price: Number(body.price),
        offer_price: Number(body.offer_price),
      };

      const validated = plainToInstance(CreateProductDto, dtoObject);
      await validateOrReject(validated);

      return this.adminService.createProduct(dtoObject);
    } catch (error) {
      if (Array.isArray(error)) {
        throw new BadRequestException(error);
      }
      throw error;
    }
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  async updateProduct(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: Omit<EditProductDto, 'media' | 'gallery'>,
  ) {
    try {
      const mediaFiles = files.filter((file) => file.fieldname === 'media');
      const galleryFiles = files.filter((file) => file.fieldname === 'gallery');

      const mediaUrls = (
        await Promise.all(
          mediaFiles.map((file) => this.cloudinaryService.uploadImage(file)),
        )
      ).filter((url): url is string => !!url);

      const galleryUrls = (
        await Promise.all(
          galleryFiles.map((file) => this.cloudinaryService.uploadImage(file)),
        )
      ).filter((url): url is string => !!url);

      const galleryMapped = galleryUrls.map((url) => ({ image_url: url }));

      const dtoObject = {
        ...body,
        ...(mediaUrls.length > 0 && { media: mediaUrls }),
        ...(galleryMapped.length > 0 && { gallery: galleryMapped }),
        ...(body.top_points !== undefined && {
          top_points: Number(body.top_points),
        }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.offer_price !== undefined && {
          offer_price: Number(body.offer_price),
        }),
      };

      const validated = plainToInstance(EditProductDto, dtoObject);
      await validateOrReject(validated);

      return this.adminService.updateProductById(id, dtoObject);
    } catch (error) {
      if (Array.isArray(error)) {
        throw new BadRequestException(error);
      }
      throw error;
    }
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProductById(id);
  }
}
