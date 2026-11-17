import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType } from '../order.entity';

export class CreateOrderItemDto {
  @Type(() => Number)
  @IsInt()
  menuItemId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateOrderDto {
  @IsEnum(OrderType)
  orderType: OrderType;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  tableId?: number;

  @IsString()
  @IsOptional()
  idempotencyKey?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
