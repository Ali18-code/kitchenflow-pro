import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StationsService } from './stations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('stations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Get()
  @Roles(UserRole.MANAGER, UserRole.KITCHEN, UserRole.WAITER)
  async findAll() {
    return this.stationsService.findAll();
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { capacitySlots?: number; waitWarnMin?: number; active?: boolean },
  ) {
    return this.stationsService.update(id, body);
  }
}
