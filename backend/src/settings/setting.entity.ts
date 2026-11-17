import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('restaurant_settings')
export class RestaurantSetting {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({
    name: 'tax_rate',
    type: 'decimal',
    precision: 5,
    scale: 4,
    default: 0.05,
  })
  taxRate: string;

  @Column({
    name: 'service_rate',
    type: 'decimal',
    precision: 5,
    scale: 4,
    default: 0.0,
  })
  serviceRate: string;

  @Column({
    name: 'currency_code',
    length: 10,
    default: 'PKR',
  })
  currencyCode: string;

  @Column({
    name: 'opening_hours',
    type: 'json',
    nullable: true,
  })
  openingHours: any;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
