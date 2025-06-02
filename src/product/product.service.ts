/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find({ isDeleted: { $ne: true } }).exec();
  }

  async findOneByUid(pid: string): Promise<Product | null> {
    const product = await this.productModel.findOne({ pid }).exec();
    if (product?.isDeleted) {
      return null;
    } else {
      return product;
    }
  }
}
