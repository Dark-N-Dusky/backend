/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import {
  CartItemDto,
  CheckoutDto,
  EditCartItemDto,
} from 'src/common/dto/cart.dto';
import { JwtTokenPayload } from 'src/common/dto/payload.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: JwtTokenPayload) {
    return this.cartService.getCartItems(req.user.uid);
  }

  @Post()
  addToCart(@Request() req: JwtTokenPayload, @Body() body: CartItemDto) {
    return this.cartService.addToCart(req.user.uid, body);
  }

  @Patch(':id')
  updateCart(
    @Request() req: JwtTokenPayload,
    @Param('id') id: string,
    @Body() body: EditCartItemDto,
  ) {
    return this.cartService.updateCart(req.user.uid, id, body);
  }

  @Delete(':id')
  removeFromCart(
    @Request() req: JwtTokenPayload,
    @Param('id') id: string,
    @Query('sizeSelected') sizeSelected?: string,
  ) {
    return this.cartService.removeFromCart(req.user.uid, id, sizeSelected);
  }

  @Post('checkout')
  checkout(@Request() req: JwtTokenPayload, @Body() body: CheckoutDto) {
    return this.cartService.checkout(req.user.uid, body);
  }
}
