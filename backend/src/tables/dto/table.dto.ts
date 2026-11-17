import { IsString, IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateTableDto {
  @IsString()
  label: string;

  @IsInt()
  @Min(1)
  seats: number;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}

export class UpdateTableDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  seats?: number;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
