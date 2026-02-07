/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  Order,
  OrderStatus,
  TrackingStatus,
} from 'src/common/entity/order.entity';
import { OrderItem } from 'src/common/entity/orderItem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getAllOrders(paginationDto: PaginationDto, uid: string) {
    const { limit = 10, offset = 0 } = paginationDto;
    const orders = await this.orderRepository.findAndCount({
      where: { uid },
      take: limit,
      skip: offset,
    });

    if (!orders) throw new NotFoundException('No orders found!');

    return orders;
  }

  async createOrder(order: Order) {
    const newOrder = this.orderRepository.create(order);

    return await this.orderRepository.save(newOrder);
  }

  async getOrderById(id: number) {
    const orderData = await this.orderRepository.findOne({ where: { id } });
    if (!orderData) throw new NotFoundException('Order not found!');

    const orderItemData = await this.orderItemRepository.find({
      where: { order_id: orderData.id },
    });
    if (!orderItemData) throw new NotFoundException('Order item not found!');

    const order = {
      orderData,
      orderItem: orderItemData,
    };

    return order;
  }

  async cancelOrder(id: number, uid: string) {
    const order = await this.orderRepository.findOne({ where: { id, uid } });
    if (!order) throw new NotFoundException('Order not found!');

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order already cancelled');
    }

    const nonCancelableTracking = [
      TrackingStatus.SHIPPED,
      TrackingStatus.DELIVERY,
      TrackingStatus.DELIVERED,
    ];

    if (nonCancelableTracking.includes(order.tracking_status as TrackingStatus)) {
      throw new BadRequestException('Order already shipped');
    }

    await this.orderRepository.update(
      { id, uid },
      { status: OrderStatus.CANCELLED },
    );

    const updatedOrder = await this.orderRepository.findOne({
      where: { id, uid },
    });

    return updatedOrder;
  }
}
