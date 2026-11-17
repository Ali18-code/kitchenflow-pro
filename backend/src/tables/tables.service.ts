import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { RestaurantTable } from './table.entity';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
import { Order, OrderStatus } from '../orders/order.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(RestaurantTable)
    private tableRepo: Repository<RestaurantTable>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async findAll(): Promise<any[]> {
    const tables = await this.tableRepo.find({
      order: { label: 'ASC' },
    });

    // Find all active orders for these tables
    const activeOrders = await this.orderRepo.find({
      where: {
        status: Not(In([OrderStatus.PAID, OrderStatus.CANCELLED])),
      },
      select: ['id', 'orderCode', 'tableId', 'status', 'total', 'createdAt'],
    });

    const activeOrderByTableId = new Map<number, Order>();
    for (const order of activeOrders) {
      if (order.tableId) {
        activeOrderByTableId.set(Number(order.tableId), order);
      }
    }

    return tables.map((t) => {
      const activeOrder = activeOrderByTableId.get(Number(t.id));
      return {
        id: Number(t.id),
        label: t.label,
        seats: t.seats,
        enabled: t.enabled,
        status: !t.enabled ? 'OUT_OF_SERVICE' : activeOrder ? 'OCCUPIED' : 'AVAILABLE',
        activeOrder: activeOrder
          ? {
              id: Number(activeOrder.id),
              orderCode: activeOrder.orderCode,
              status: activeOrder.status,
              total: activeOrder.total,
              createdAt: activeOrder.createdAt,
            }
          : null,
      };
    });
  }

  async findById(id: number): Promise<RestaurantTable> {
    const table = await this.tableRepo.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }
    return table;
  }

  async createTable(dto: CreateTableDto): Promise<RestaurantTable> {
    const existing = await this.tableRepo.findOne({ where: { label: dto.label } });
    if (existing) {
      throw new ConflictException(`Table with label '${dto.label}' already exists`);
    }
    const table = this.tableRepo.create(dto);
    return this.tableRepo.save(table);
  }

  async updateTable(id: number, dto: UpdateTableDto): Promise<RestaurantTable> {
    const table = await this.findById(id);
    if (dto.label && dto.label !== table.label) {
      const existing = await this.tableRepo.findOne({ where: { label: dto.label } });
      if (existing) {
        throw new ConflictException(`Table with label '${dto.label}' already exists`);
      }
    }
    Object.assign(table, dto);
    return this.tableRepo.save(table);
  }
}
