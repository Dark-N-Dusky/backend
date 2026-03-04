/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/common/entity/order.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { JwtTokenPayload } from 'src/common/dto/payload.dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(
    @Query() paginationDto: PaginationDto,
    @Request() req: JwtTokenPayload,
  ) {
    return this.orderService.getAllOrders(paginationDto, req.user.uid);
  }

  @Post()
  createOrder(@Body() order: Order) {
    return this.orderService.createOrder(order);
  }

  @Get(':id')
  getOrderById(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: number, @Request() req: JwtTokenPayload) {
    return this.orderService.cancelOrder(id, req.user.uid);
  }
}
