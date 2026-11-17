import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MenuCategory } from './category.entity';
import { PrepStation } from '../stations/station.entity';
import { RecipeItem } from '../inventory/recipe-item.entity';
import { OrderItem } from '../orders/order-item.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @ManyToOne(() => MenuCategory, (cat) => cat.items, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: MenuCategory;

  @Column({ name: 'station_id', type: 'bigint' })
  stationId: number;

  @ManyToOne(() => PrepStation, (st) => st.menuItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'station_id' })
  station: PrepStation;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: string;

  @Column({ name: 'prep_minutes', type: 'int', default: 10 })
  prepMinutes: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @Column({ name: 'image_url', length: 255, nullable: true })
  imageUrl: string;

  @OneToMany(() => RecipeItem, (recipe) => recipe.menuItem)
  recipes: RecipeItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menuItem)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
