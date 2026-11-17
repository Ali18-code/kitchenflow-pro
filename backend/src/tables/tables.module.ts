import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantTable } from './table.entity';
import { Order } from '../orders/order.entity';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantTable, Order])],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
