import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { MenuItem } from '../menu/menu-item.entity';
import { OrderItem } from '../orders/order-item.entity';

@Entity('prep_stations')
export class PrepStation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 80, unique: true })
  name: string;

  @Column({ name: 'capacity_slots', type: 'int', default: 1 })
  capacitySlots: number;

  @Column({ name: 'wait_warn_min', type: 'int', default: 20 })
  waitWarnMin: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ManyToMany(() => User, (user) => user.stations)
  assignedStaff: User[];

  @OneToMany(() => MenuItem, (item) => item.station)
  menuItems: MenuItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.station)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
