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
import { UsersService } from './users.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './user.entity';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.MANAGER)
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(UserRole.MANAGER)
  async createStaff(@Body() dto: CreateStaffDto) {
    return this.usersService.createStaff(dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.MANAGER)
  async setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('active') active: boolean,
  ) {
    return this.usersService.setStatus(id, active);
  }
}
