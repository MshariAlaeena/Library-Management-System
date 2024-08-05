import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';

export class UpdateBookDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsDate()
  @IsOptional()
  publishedDate: Date;

  @IsNumber()
  @IsOptional()
  isbn?: number;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  availableCopies?: number;

  @IsString()
  @IsOptional()
  borrowingStatus?: 'available' | 'pending' | 'borrowed';
  // borrowed is equavilent to approved

  @IsDate()
  @IsOptional()
  borrowedUntil?: Date | null;
}
