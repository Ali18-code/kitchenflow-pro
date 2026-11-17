import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from './category.entity';
import { MenuItem } from './menu-item.entity';
import { CreateCategoryDto, CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu.dto';
import { PrepStation } from '../stations/station.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuCategory)
    private categoryRepo: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
    @InjectRepository(PrepStation)
    private stationRepo: Repository<PrepStation>,
  ) {}

  async getCategories(): Promise<MenuCategory[]> {
    return this.categoryRepo.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
      relations: ['items'],
    });
  }

  async createCategory(dto: CreateCategoryDto): Promise<MenuCategory> {
    const existing = await this.categoryRepo.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException(`Category '${dto.name}' already exists`);
    }
    const cat = this.categoryRepo.create({
      name: dto.name,
      sortOrder: dto.sortOrder || 0,
      enabled: true,
    });
    return this.categoryRepo.save(cat);
  }

  async getItems(options?: {
    categoryId?: number;
    search?: string;
    availableOnly?: boolean;
  }): Promise<MenuItem[]> {
    const qb = this.menuItemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.station', 'station')
      .leftJoinAndSelect('item.recipes', 'recipes')
      .leftJoinAndSelect('recipes.ingredient', 'ingredient');

    if (options?.categoryId) {
      qb.andWhere('item.categoryId = :catId', { catId: options.categoryId });
    }

    if (options?.availableOnly) {
      qb.andWhere('item.available = :avail', { avail: true });
    }

    if (options?.search) {
      qb.andWhere('LOWER(item.name) LIKE LOWER(:search)', {
        search: `%${options.search}%`,
      });
    }

    qb.orderBy('category.sortOrder', 'ASC').addOrderBy('item.name', 'ASC');

    return qb.getMany();
  }

  async getItemById(id: number): Promise<MenuItem> {
    const item = await this.menuItemRepo.findOne({
      where: { id },
      relations: ['category', 'station', 'recipes', 'recipes.ingredient'],
    });
    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return item;
  }

  async createItem(dto: CreateMenuItemDto): Promise<MenuItem> {
    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
    }

    const station = await this.stationRepo.findOne({ where: { id: dto.stationId } });
    if (!station) {
      throw new NotFoundException(`Station with ID ${dto.stationId} not found`);
    }

    const item = this.menuItemRepo.create({
      name: dto.name,
      categoryId: dto.categoryId,
      stationId: dto.stationId,
      price: dto.price.toFixed(2),
      prepMinutes: dto.prepMinutes,
      available: dto.available ?? true,
      imageUrl: dto.imageUrl,
    });

    return this.menuItemRepo.save(item);
  }

  async updateItem(id: number, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const item = await this.getItemById(id);

    if (dto.categoryId && dto.categoryId !== item.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
      item.categoryId = dto.categoryId;
    }

    if (dto.stationId && dto.stationId !== item.stationId) {
      const station = await this.stationRepo.findOne({ where: { id: dto.stationId } });
      if (!station) throw new NotFoundException(`Station with ID ${dto.stationId} not found`);
      item.stationId = dto.stationId;
    }

    if (dto.name) item.name = dto.name;
    if (dto.price !== undefined) item.price = dto.price.toFixed(2);
    if (dto.prepMinutes !== undefined) item.prepMinutes = dto.prepMinutes;
    if (dto.available !== undefined) item.available = dto.available;
    if (dto.imageUrl !== undefined) item.imageUrl = dto.imageUrl;

    return this.menuItemRepo.save(item);
  }
}
