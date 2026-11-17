import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { MenuItem } from '../menu/menu-item.entity';
import { Ingredient } from './ingredient.entity';

@Entity('recipe_items')
@Unique(['menuItemId', 'ingredientId'])
export class RecipeItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'menu_item_id', type: 'bigint' })
  menuItemId: number;

  @ManyToOne(() => MenuItem, (item) => item.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'ingredient_id', type: 'bigint' })
  ingredientId: number;

  @ManyToOne(() => Ingredient, (ing) => ing.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({
    name: 'qty_per_item',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  qtyPerItem: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
