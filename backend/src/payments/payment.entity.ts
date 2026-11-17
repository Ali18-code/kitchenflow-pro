import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

export enum PaymentMethod {
  CASH = 'CASH',
}

export enum PaymentStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'order_id', type: 'bigint', unique: true })
  orderId: number;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @Column({ length: 100, nullable: true })
  reference: string;

  @Column({ name: 'collected_by', type: 'bigint' })
  collectedById: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'collected_by' })
  collectedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
