/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@ObjectType()
@Schema({ _id: false })
export class Address {
  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  line1: string;

  @Field({ nullable: true })
  @Prop()
  line2: string;

  @Field()
  @Prop({ required: true })
  city: string;

  @Field()
  @Prop({ required: true })
  state: string;

  @Field()
  @Prop({ required: true })
  country: string;

  @Field()
  @Prop({ required: true })
  code: number;

  @Field()
  @Prop({ required: true })
  number: string;

  @Field({ nullable: true })
  @Prop()
  alternate_number: string;

  @Field()
  @Prop({ enum: ['home', 'work'], required: true })
  type: 'home' | 'work';

  @Field({ nullable: true })
  @Prop()
  weekend_availability: boolean;
}

@ObjectType()
@Schema({ _id: false })
export class WishlistItem {
  @Field()
  @Prop({ required: true })
  product_id: string;
}

@ObjectType()
@Schema({ _id: false })
export class CartItem {
  @Field()
  @Prop({ required: true })
  product_id: string;

  @Field()
  @Prop({ required: true })
  quantity: number;
}

@ObjectType()
@Schema({ _id: false })
export class CouponUsed {
  @Field()
  @Prop({ required: true })
  coupon_id: string;
}

@ObjectType()
@Schema()
export class User {
  @Field()
  @Prop({ required: true })
  uid: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  number: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  password?: string;

  @Field(() => String)
  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Field(() => String)
  @Prop({ enum: ['local', 'google'], default: 'local' })
  auth_type: 'local' | 'google';

  @Field({ nullable: true })
  @Prop({ required: false })
  google_id?: string;

  @Field({ nullable: true })
  @Prop()
  profile_url: string;

  @Field({ nullable: true })
  @Prop()
  dob: Date;

  // @Field({ nullable: true })
  // @Prop()
  // address: string;

  @Field(() => [Address], { nullable: 'itemsAndList' })
  @Prop({ type: [Address], required: false })
  addressDetails: Address[];

  @Field(() => [WishlistItem], { nullable: 'itemsAndList' })
  @Prop({ type: [WishlistItem], required: false })
  wishlist: WishlistItem[];

  @Field(() => [CartItem], { nullable: 'itemsAndList' })
  @Prop({ type: [CartItem], required: false })
  cart: CartItem[];

  @Field(() => [CouponUsed], { nullable: 'itemsAndList' })
  @Prop({ type: [CouponUsed], required: false })
  coupons_used: CouponUsed[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const AddressSchema = SchemaFactory.createForClass(Address);
export const WishlistItemSchema = SchemaFactory.createForClass(WishlistItem);
export const CartItemSchema = SchemaFactory.createForClass(CartItem);
export const CouponUsedSchema = SchemaFactory.createForClass(CouponUsed);
