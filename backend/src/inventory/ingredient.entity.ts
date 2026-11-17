import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RecipeItem } from './recipe-item.entity';
import { StockMovement } from './stock-movement.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 20 })
  unit: string;

  @Column({
    name: 'stock_qty',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  stockQty: string;

  @Column({
    name: 'reorder_qty',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 10.0,
  })
  reorderQty: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => RecipeItem, (recipe) => recipe.ingredient)
  recipes: RecipeItem[];

  @OneToMany(() => StockMovement, (sm) => sm.ingredient)
  movements: StockMovement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
