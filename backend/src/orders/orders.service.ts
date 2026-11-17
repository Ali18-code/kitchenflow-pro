import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not, In } from 'typeorm';
import { Order, OrderType, OrderStatus } from './order.entity';
import { OrderItem, ItemStatus } from './order-item.entity';
import { RestaurantTable } from '../tables/table.entity';
import { MenuItem } from '../menu/menu-item.entity';
import { RestaurantSetting } from '../settings/setting.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(RestaurantTable)
    private tableRepo: Repository<RestaurantTable>,
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
    @InjectRepository(RestaurantSetting)
    private settingRepo: Repository<RestaurantSetting>,
    private dataSource: DataSource,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: number): Promise<Order> {
    // 1. Idempotency Check
    if (dto.idempotencyKey) {
      const existing = await this.orderRepo.findOne({
        where: { idempotencyKey: dto.idempotencyKey },
        relations: ['items', 'items.menuItem', 'items.station', 'table'],
      });
      if (existing) {
        return existing;
      }
    }

    // 2. Validate Dine-in table requirements
    if (dto.orderType === OrderType.DINE_IN) {
      if (!dto.tableId) {
        throw new BadRequestException('tableId is required for DINE_IN orders');
      }

      const table = await this.tableRepo.findOne({ where: { id: dto.tableId } });
      if (!table) {
        throw new NotFoundException(`Table with ID ${dto.tableId} not found`);
      }
      if (!table.enabled) {
        throw new BadRequestException(`Table ${table.label} is currently out of service`);
      }

      // Check if table already has an active dine-in order
      const activeTableOrder = await this.orderRepo.findOne({
        where: {
          tableId: dto.tableId,
          orderType: OrderType.DINE_IN,
          status: Not(In([OrderStatus.PAID, OrderStatus.CANCELLED])),
        },
      });

      if (activeTableOrder) {
        throw new ConflictException(
          `Table ${table.label} already has an active order (${activeTableOrder.orderCode})`,
        );
      }
    }

    // 3. Run transactional order creation
    return this.dataSource.transaction(async (manager) => {
      // Fetch settings for tax
      let taxRate = 0.05;
      const settings = await manager.findOne(RestaurantSetting, { where: { id: 1 } });
      if (settings && settings.taxRate) {
        taxRate = parseFloat(settings.taxRate);
      }

      // Load all menu items to snapshot prices and stations
      let subtotalNum = 0;
      const orderItemsToCreate: OrderItem[] = [];

      for (const itemDto of dto.items) {
        const menuItem = await manager.findOne(MenuItem, {
          where: { id: itemDto.menuItemId },
        });

        if (!menuItem) {
          throw new NotFoundException(`Menu item ${itemDto.menuItemId} not found`);
        }
        if (!menuItem.available) {
          throw new BadRequestException(`Menu item "${menuItem.name}" is currently unavailable`);
        }

        const unitPriceNum = parseFloat(menuItem.price);
        subtotalNum += unitPriceNum * itemDto.quantity;

        const orderItem = manager.create(OrderItem, {
          menuItemId: menuItem.id,
          stationId: menuItem.stationId,
          qty: itemDto.quantity,
          unitPrice: unitPriceNum.toFixed(2),
          prepMinutes: menuItem.prepMinutes,
          itemStatus: ItemStatus.QUEUED,
          notes: itemDto.notes || null,
        });

        orderItemsToCreate.push(orderItem);
      }

      const taxNum = Math.round(subtotalNum * taxRate * 100) / 100;
      const totalNum = subtotalNum + taxNum;

      // Generate order code
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderCode = `ORD-${dateStr}-${randomSuffix}`;

      const order = manager.create(Order, {
        orderCode,
        idempotencyKey: dto.idempotencyKey || null,
        tableId: dto.orderType === OrderType.DINE_IN ? dto.tableId : null,
        orderType: dto.orderType,
        status: OrderStatus.PLACED,
        createdById: userId,
        subtotal: subtotalNum.toFixed(2),
        discount: '0.00',
        tax: taxNum.toFixed(2),
        total: totalNum.toFixed(2),
      });

      const savedOrder = await manager.save(Order, order);

      for (const orderItem of orderItemsToCreate) {
        orderItem.orderId = savedOrder.id;
        await manager.save(OrderItem, orderItem);
      }

      // Return order with populated relationships
      return manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ['items', 'items.menuItem', 'items.station', 'table'],
      });
    });
  }

  async findAll(options?: {
    status?: OrderStatus;
    orderType?: OrderType;
    tableId?: number;
    search?: string;
  }): Promise<Order[]> {
    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.menuItem', 'menuItem')
      .leftJoinAndSelect('items.station', 'station')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.createdBy', 'createdBy')
      .leftJoinAndSelect('order.payment', 'payment');

    if (options?.status) {
      qb.andWhere('order.status = :status', { status: options.status });
    }

    if (options?.orderType) {
      qb.andWhere('order.orderType = :orderType', { orderType: options.orderType });
    }

    if (options?.tableId) {
      qb.andWhere('order.tableId = :tableId', { tableId: options.tableId });
    }

    if (options?.search) {
      qb.andWhere('(order.orderCode LIKE :search OR table.label LIKE :search)', {
        search: `%${options.search}%`,
      });
    }

    qb.orderBy('order.createdAt', 'DESC');
    return qb.getMany();
  }

  async findById(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: [
        'items',
        'items.menuItem',
        'items.station',
        'table',
        'createdBy',
        'payment',
      ],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async cancelOrder(id: number, userId: number): Promise<Order> {
    const order = await this.findById(id);

    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('Cannot cancel an order that has already been paid');
    }

    // If order has already started in the kitchen, reject plain waiter cancellation
    const isCooking = order.items.some((i) => i.itemStatus === ItemStatus.PREPARING);
    if (isCooking) {
      throw new ConflictException(
        'Cannot cancel order: kitchen preparation has already started. Requires manager void.',
      );
    }

    order.status = OrderStatus.CANCELLED;
    for (const item of order.items) {
      if (item.itemStatus === ItemStatus.QUEUED) {
        item.itemStatus = ItemStatus.CANCELLED;
        await this.orderItemRepo.save(item);
      }
    }

    return this.orderRepo.save(order);
  }
}
