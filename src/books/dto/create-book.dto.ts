import { IsString, IsOptional, IsInt, Min, IsNumber, IsPositive, IsDateString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  isbn: string;

  @IsInt()
  @Min(0)
  totalCount: number;

  @IsInt()
  @Min(0)
  availabilityCount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}