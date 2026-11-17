import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RestaurantTable } from '../tables/table.entity';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

@Entity('reservations')
@Index(['tableId', 'startAt', 'endAt', 'status'])
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'table_id', type: 'bigint' })
  tableId: number;

  @ManyToOne(() => RestaurantTable, (tbl) => tbl.reservations, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'table_id' })
  table: RestaurantTable;

  @Column({ name: 'guest_name', length: 100 })
  guestName: string;

  @Column({ length: 50 })
  contact: string;

  @Column({ type: 'int', default: 2 })
  guests: number;

  @Column({ name: 'start_at', type: 'datetime' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'datetime' })
  endAt: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.CONFIRMED,
  })
  status: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
