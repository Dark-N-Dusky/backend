/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum TrackingStatus {
  PENDING = 'pending',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  DELIVERY = 'delivery',
  DELIVERED = 'delivered',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 36,
  })
  uid: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: '0',
  })
  address_id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: TrackingStatus,
    default: TrackingStatus.PENDING,
  })
  tracking_status: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // @Column({
  //   type: 'varchar',
  //   nullable: true,
  //   default: 'NA',
  // })
  // size: string;
}
