import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Entities
import { User } from './users/user.entity';
import { PrepStation } from './stations/station.entity';
import { RestaurantTable } from './tables/table.entity';
import { MenuCategory } from './menu/category.entity';
import { MenuItem } from './menu/menu-item.entity';
import { Ingredient } from './inventory/ingredient.entity';
import { RecipeItem } from './inventory/recipe-item.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { StockMovement } from './inventory/stock-movement.entity';
import { Payment } from './payments/payment.entity';
import { Reservation } from './reservations/reservation.entity';
import { RestaurantSetting } from './settings/setting.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      PrepStation,
      RestaurantTable,
      MenuCategory,
      MenuItem,
      Ingredient,
      RecipeItem,
      Order,
      OrderItem,
      StockMovement,
      Payment,
      Reservation,
      RestaurantSetting,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
