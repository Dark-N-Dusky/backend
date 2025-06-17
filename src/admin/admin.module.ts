/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { OrdersController } from './orders/orders.controller';
import { CategoriesController } from './categories/categories.controller';
import { CouponsController } from './coupons/coupons.controller';
import { ProductsController } from './products/products.controller';
import { ReturnsController } from './returns/returns.controller';
import { User, UserSchema } from 'src/common/schema/user.schema';
import { Product, ProductSchema } from 'src/common/schema/product.schema';
import { Return } from 'src/common/entity/return.entity';
import { Order } from 'src/common/entity/order.entity';
import { OrderItem } from 'src/common/entity/orderItem.entity';
import { CloudinaryService } from 'src/common/util/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    TypeOrmModule.forFeature([Return, Order, OrderItem]),
  ],
  controllers: [
    AdminController,
    OrdersController,
    CategoriesController,
    CouponsController,
    ProductsController,
    ReturnsController,
  ],
  providers: [AdminService, CloudinaryService],
})
export class AdminModule {}
