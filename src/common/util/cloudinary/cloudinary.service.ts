/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string | null> {
    try {
      return await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
          },
          (error, result: UploadApiResponse) => {
            if (error) {
              this.logger.error(
                `Cloudinary upload error: ${error.message}`,
                error.stack,
              );
              return reject(new Error(error.message || JSON.stringify(error)));
            }
            resolve(result.secure_url);
          },
        );
        Readable.from(file.buffer).pipe(stream);
      });
    } catch (error: any) {
      this.logger.warn(
        `Failed to upload file: ${file.originalname}`,
        typeof error === 'object' && error && 'stack' in error
          ? (error as Error).stack
          : undefined,
      );
      throw new InternalServerErrorException('Error uploading files');
    }
  }
}
