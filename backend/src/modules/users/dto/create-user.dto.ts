import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  name: string;

  @IsEmail({}, { message: 'Valid email address is required' })
  email: string;

  @IsEnum(UserRole, { message: 'Role must be ADMIN, INVENTORY_MANAGER, or SALES_STAFF' })
  role: UserRole;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {
      message:
        'Password must contain an uppercase letter, a lowercase letter, and at least one number or symbol',
    },
  )
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
