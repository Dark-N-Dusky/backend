/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import {
  CartItemDto,
  CheckoutDto,
  EditCartItemDto,
} from 'src/common/dto/cart.dto';
import { Order } from 'src/common/entity/order.entity';
import { OrderItem } from 'src/common/entity/orderItem.entity';
import { Product } from 'src/common/schema/product.schema';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  private normalizeSize(size?: string | null) {
    const trimmed = size?.trim();
    return trimmed ? trimmed : 'NA';
  }

  async getCartItems(uid: string) {
    const user = await this.userModel.findOne({ uid: uid }).exec();
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const cart = user.cart;
    return cart;
  }

  async addToCart(uid: string, body: CartItemDto) {
    const user = await this.userModel.findOne({ uid: uid }).exec();
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const incomingSize = this.normalizeSize(body.sizeSelected);
    const existingItem = user.cart.find(
      (item) =>
        item.product_id.toString() === body.product_id.toString() &&
        this.normalizeSize(item.sizeSelected) === incomingSize,
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      user.cart.push({
        ...body,
        sizeSelected: incomingSize,
      });
    }

    await user.save();
    return 'Item added to cart successfully';
  }

  async updateCart(uid: string, pid: string, body: EditCartItemDto) {
    const user = await this.userModel.findOne({ uid: uid }).exec();
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const targetSize = this.normalizeSize(body.sizeSelected);
    const cartItem = user.cart.find(
      (item) =>
        item.product_id === pid &&
        (targetSize === null ||
          this.normalizeSize(item.sizeSelected) === targetSize),
    );
    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    if (body.quantity !== undefined) {
      cartItem.quantity = body.quantity;
    }
    await user.save();
    return 'Cart updated successfully';
  }

  async removeFromCart(uid: string, id: string, sizeSelected?: string) {
    const user = await this.userModel.findOne({ uid: uid }).exec();
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const targetSize = this.normalizeSize(sizeSelected);
    const cartItemIndex = user.cart.findIndex((item) => {
      if (item.product_id !== id) {
        return false;
      }

      if (targetSize === null) {
        return true;
      }

      return this.normalizeSize(item.sizeSelected) === targetSize;
    });
    if (cartItemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    user.cart.splice(cartItemIndex, 1);
    await user.save();
    return 'Item removed from cart successfully';
  }

  async checkout(uid: string, body: CheckoutDto) {
    const hasPid = !!body.pid?.trim();
    const user = await this.userModel.findOne({ uid: uid }).exec();
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    if (hasPid) {
      const quantity = body.quantity ? body.quantity : 1;
      const address = body.quantity ? body.address_id : 0;
      const pid = body.pid;
      const size = this.normalizeSize(body.sizeSelected);
      try {
        const item = await this.productModel.findOne({ pid: pid }).exec();
        if (!item) {
          throw new NotFoundException('Product not found');
        }
      } catch (err) {
        throw new InternalServerErrorException({
          message: 'Failed to fetch product data',
          error: err as Error,
        });
      }

      const order = { uid: uid, address_id: address.toString() };
      const orderData = await this.orderRepository.save(order);
      if (!orderData) {
        throw new InternalServerErrorException('Failed to create order item');
      }

      const orderItem = {
        order_id: orderData.id,
        product_id: pid,
        quantity: quantity,
        selectedSize: size,
      };

      const orderItemData = await this.orderItemRepository.save(orderItem);
      if (!orderItemData) {
        throw new InternalServerErrorException('Failed to create order item');
      }

      return 'Order created successfully for product';
    }

    const cart = user.cart;
    if (cart.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const order = { uid: uid, address: body.address_id };
    const orderData = await this.orderRepository.save(order);
    if (!orderData) {
      throw new InternalServerErrorException('Failed to create order item');
    }
    const orderItems = cart.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      selectedSize: this.normalizeSize(item.sizeSelected),
    }));
    const orderItemData = await this.orderItemRepository.save(orderItems);

    if (!orderItemData) {
      throw new InternalServerErrorException('Failed to create order item');
    }

    user.cart = [];
    await user.save();

    return 'Order created successfully for cart items';
  }
}
