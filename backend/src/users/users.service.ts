import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserRole } from './user.entity';
import { PrepStation } from '../stations/station.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PrepStation)
    private stationRepository: Repository<PrepStation>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['stations'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['stations'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['stations'],
      order: { role: 'ASC', name: 'ASC' },
      select: ['id', 'name', 'email', 'role', 'active', 'createdAt'],
    });
  }

  async createStaff(dto: CreateStaffDto): Promise<User> {
    const existing = await this.findByEmail(dto.email.trim());
    if (existing) {
      throw new ConflictException(`An account with email '${dto.email}' already exists`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.usersRepository.create({
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      passwordHash,
      role: dto.role,
      active: true,
    });

    if (dto.stationIds && dto.stationIds.length > 0) {
      const stations = await this.stationRepository.findBy({
        id: In(dto.stationIds),
      });
      user.stations = stations;
    }

    const saved = await this.usersRepository.save(user);
    const { passwordHash: _, ...result } = saved;
    return result as User;
  }

  async setStatus(id: number, active: boolean): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Staff user with ID ${id} not found`);
    }
    user.active = active;
    const saved = await this.usersRepository.save(user);
    const { passwordHash: _, ...result } = saved;
    return result as User;
  }
}
