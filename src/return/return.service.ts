/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { CreateReturnDto } from 'src/common/dto/return.dto';
import { Order } from 'src/common/entity/order.entity';
import { Return } from 'src/common/entity/return.entity';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class ReturnService {
  constructor(
    @InjectRepository(Return)
    private readonly returnRepository: Repository<Return>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getReturns(uid: string) {
    const returns = await this.returnRepository.find({ where: { uid } });
    if (!returns || returns.length === 0) {
      return [];
    }

    return returns;
  }

  async createReturn(uid: string, body: CreateReturnDto) {
    const user = await this.userModel.findOne({ uid });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const order = await this.orderRepository.findOne({
      where: { id: body.orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const returnData = {
      uid,
      orderId: body.orderId,
      productItemId: body.productItemId,
    };

    const newReturn = await this.returnRepository.save(returnData);
    return newReturn;
  }
}
