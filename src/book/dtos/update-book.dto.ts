import {
  IsString,
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
  isbn?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  availableCopies?: number;
}
