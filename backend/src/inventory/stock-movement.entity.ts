import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { OrderItem } from '../orders/order-item.entity';
import { User } from '../users/user.entity';

export enum MovementType {
  CONSUMPTION = 'CONSUMPTION',
  REVERSAL = 'REVERSAL',
  RESTOCK = 'RESTOCK',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('stock_movements')
@Unique(['orderItemId', 'ingredientId', 'movementType'])
export class StockMovement {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'ingredient_id', type: 'bigint' })
  ingredientId: number;

  @ManyToOne(() => Ingredient, (ing) => ing.movements, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ name: 'order_item_id', type: 'bigint', nullable: true })
  orderItemId: number;

  @ManyToOne(() => OrderItem, (oi) => oi.stockMovements, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;

  @Column({
    name: 'movement_type',
    type: 'enum',
    enum: MovementType,
  })
  movementType: MovementType;

  @Column({
    name: 'qty_delta',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  qtyDelta: string;

  @Column({ length: 255 })
  reason: string;

  @Column({ name: 'created_by', type: 'bigint' })
  createdById: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
