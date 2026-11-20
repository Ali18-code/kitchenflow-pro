import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsEmail({}, { message: 'A valid email is required' })
  email: string;

  @IsEnum(UserRole, { message: 'Role must be ADMIN, INVENTORY_MANAGER, or SALES_STAFF' })
  role: UserRole;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
