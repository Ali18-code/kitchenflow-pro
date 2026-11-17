import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, OrderType } from './order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.WAITER, UserRole.MANAGER)
  async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.createOrder(dto, user.id);
  }

  @Get()
  @Roles(UserRole.WAITER, UserRole.MANAGER, UserRole.KITCHEN, UserRole.CASHIER)
  async findAll(
    @Query('status') status?: OrderStatus,
    @Query('orderType') orderType?: OrderType,
    @Query('tableId') tableId?: string,
    @Query('search') search?: string,
  ) {
    return this.ordersService.findAll({
      status,
      orderType,
      tableId: tableId ? parseInt(tableId, 10) : undefined,
      search,
    });
  }

  @Get(':id')
  @Roles(UserRole.WAITER, UserRole.MANAGER, UserRole.KITCHEN, UserRole.CASHIER)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findById(id);
  }

  @Post(':id/cancel')
  @Roles(UserRole.WAITER, UserRole.MANAGER)
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.cancelOrder(id, user.id);
  }
}
