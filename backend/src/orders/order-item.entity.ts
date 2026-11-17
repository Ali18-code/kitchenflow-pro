import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './order.entity';
import { MenuItem } from '../menu/menu-item.entity';
import { PrepStation } from '../stations/station.entity';
import { StockMovement } from '../inventory/stock-movement.entity';

export enum ItemStatus {
  QUEUED = 'QUEUED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
}

@Entity('order_items')
@Index(['stationId', 'itemStatus', 'createdAt'])
export class OrderItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'menu_item_id', type: 'bigint' })
  menuItemId: number;

  @ManyToOne(() => MenuItem, (item) => item.orderItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'station_id', type: 'bigint' })
  stationId: number;

  @ManyToOne(() => PrepStation, (st) => st.orderItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'station_id' })
  station: PrepStation;

  @Column({ type: 'int', default: 1 })
  qty: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })
  unitPrice: string;

  @Column({ name: 'prep_minutes', type: 'int', default: 10 })
  prepMinutes: number;

  @Column({
    name: 'item_status',
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.QUEUED,
  })
  itemStatus: ItemStatus;

  @Column({ length: 255, nullable: true })
  notes: string;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'ready_at', type: 'timestamp', nullable: true })
  readyAt: Date;

  @OneToMany(() => StockMovement, (sm) => sm.orderItem)
  stockMovements: StockMovement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
