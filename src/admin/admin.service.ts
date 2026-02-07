/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { UpdateOrderDto } from 'src/common/dto/order.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from 'src/common/dto/product.dto';
import { UpdateReturnDto } from 'src/common/dto/return.dto';
import { Order } from 'src/common/entity/order.entity';
import { OrderItem } from 'src/common/entity/orderItem.entity';
import { Return } from 'src/common/entity/return.entity';
import { Product, ProductDocument } from 'src/common/schema/product.schema';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectRepository(Return)
    private readonly returnRepository: Repository<Return>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getAllReturns(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const returns = await this.returnRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    if (!returns) {
      throw new NotFoundException('No returns found');
    }

    return returns;
  }

  async updateReturnById(id: number, body: UpdateReturnDto) {
    const returnItem = await this.returnRepository.findOne({ where: { id } });

    if (!returnItem) {
      throw new NotFoundException(`Return with id ${id} not found`);
    }

    await this.returnRepository.update(id, {
      status: body.status,
      trackingStatus: body.trackingStatus,
    });

    const updatedReturn = await this.returnRepository.findOne({
      where: { id },
    });

    return updatedReturn;
  }

  async createProduct(body: CreateProductDto) {
    const newProduct = await this.productModel.create({
      ...body,
      pid: uuid(),
    });

    if (!newProduct) {
      throw new NotFoundException('Product not created');
    }

    return newProduct;
  }

  async updateProductById(id: string, body: Partial<CreateProductDto>) {
    try {
      const updatedProduct = await this.productModel.findOneAndUpdate(
        { pid: id },
        { ...body },
        { new: true },
      );

      if (!updatedProduct) {
        throw new NotFoundException(`Product not found`);
      }

      return updatedProduct;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Unable to update product');
    }
  }

  async deleteProductById(id: string) {
    try {
      const product = await this.productModel.findOneAndUpdate(
        { pid: id },
        { isDeleted: true },
      );
      if (product) {
        return product;
      } else {
        throw new NotFoundException('Product not found');
      }
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Unable to process request');
    }
  }

  async getAllOrders(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const orders = await this.orderRepository.findAndCount({
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    if (!orders) {
      throw new NotFoundException('No orders found');
    }

    return orders;
  }

  async getOrderById(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    const orderItems = await this.orderItemRepository.find({
      where: { order_id: id },
    });

    return { order, orderItems };
  }

  async updateOrderById(id: number, body: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    await this.orderRepository.update(id, {
      status: body.status,
      tracking_status: body.trackingStatus,
    });

    const updatedOrder = await this.orderRepository.findOne({ where: { id } });

    return updatedOrder;
  }
}
