import {
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class BorrowRequestDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  bookId: number;

  @IsNumber()
  numberOfDays: number;

  @IsOptional()
  @IsString()
  status?: 'pending' | 'approved' | 'rejected';
}
