import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  Matches,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../user.entity';

export class CreateStaffDto {
  @IsString({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  name: string;

  @IsEmail({}, { message: 'A valid email address is required' })
  email: string;

  @IsEnum(UserRole, { message: 'Role must be manager, waiter, kitchen, or cashier' })
  role: UserRole;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {
      message:
        'Password must contain an uppercase letter, a lowercase letter, and at least one number or special character',
    },
  )
  password: string;

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  stationIds?: number[];
}
