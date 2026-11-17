import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RestaurantTable } from '../tables/table.entity';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../payments/payment.entity';

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
}

export enum OrderStatus {
  PLACED = 'PLACED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
@Index(['orderType', 'status', 'createdAt'])
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'order_code', length: 50, unique: true })
  orderCode: string;

  @Column({ name: 'idempotency_key', length: 100, nullable: true, unique: true })
  idempotencyKey: string;

  @Column({ name: 'table_id', type: 'bigint', nullable: true })
  tableId: number;

  @ManyToOne(() => RestaurantTable, (tbl) => tbl.orders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'table_id' })
  table: RestaurantTable;

  @Column({
    name: 'order_type',
    type: 'enum',
    enum: OrderType,
    default: OrderType.DINE_IN,
  })
  orderType: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PLACED,
  })
  status: OrderStatus;

  @Column({ name: 'created_by', type: 'bigint' })
  createdById: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  subtotal: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  discount: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  tax: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  total: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
