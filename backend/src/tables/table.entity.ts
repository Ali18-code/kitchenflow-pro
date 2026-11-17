import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Reservation } from '../reservations/reservation.entity';

@Entity('restaurant_tables')
export class RestaurantTable {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 50, unique: true })
  label: string;

  @Column({ type: 'int', default: 4 })
  seats: number;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];

  @OneToMany(() => Reservation, (res) => res.table)
  reservations: Reservation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
