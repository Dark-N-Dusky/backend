/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'varchar',
  })
  product_id: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  selectedSize: string;

  @Column({
    type: 'int',
  })
  order_id: number;
}
