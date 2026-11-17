import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { PrepStation } from '../stations/station.entity';
import { Order } from '../orders/order.entity';

export enum UserRole {
  MANAGER = 'manager',
  WAITER = 'waiter',
  KITCHEN = 'kitchen',
  CASHIER = 'cashier',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.WAITER,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ManyToMany(() => PrepStation, (station) => station.assignedStaff)
  @JoinTable({
    name: 'staff_stations',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'station_id', referencedColumnName: 'id' },
  })
  stations: PrepStation[];

  @OneToMany(() => Order, (order) => order.createdBy)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
