import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrepStation } from './station.entity';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(PrepStation)
    private stationRepo: Repository<PrepStation>,
  ) {}

  async findAll(): Promise<PrepStation[]> {
    return this.stationRepo.find({
      order: { name: 'ASC' },
      relations: ['assignedStaff'],
    });
  }

  async findById(id: number): Promise<PrepStation> {
    const station = await this.stationRepo.findOne({
      where: { id },
      relations: ['assignedStaff'],
    });
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    return station;
  }

  async update(id: number, data: { capacitySlots?: number; waitWarnMin?: number; active?: boolean }) {
    const station = await this.findById(id);
    if (data.capacitySlots !== undefined) station.capacitySlots = data.capacitySlots;
    if (data.waitWarnMin !== undefined) station.waitWarnMin = data.waitWarnMin;
    if (data.active !== undefined) station.active = data.active;
    return this.stationRepo.save(station);
  }
}
