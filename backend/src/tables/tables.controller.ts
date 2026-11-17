import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('tables')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @Get()
  @Roles(UserRole.MANAGER, UserRole.WAITER, UserRole.CASHIER)
  async findAll() {
    return this.tablesService.findAll();
  }

  @Post()
  @Roles(UserRole.MANAGER)
  async createTable(@Body() dto: CreateTableDto) {
    return this.tablesService.createTable(dto);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER)
  async updateTable(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableDto,
  ) {
    return this.tablesService.updateTable(id, dto);
  }
}
