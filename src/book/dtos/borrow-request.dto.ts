import { IsNumber, IsString, IsOptional, IsDateString, isNumber } from 'class-validator';

export class BorrowRequestDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  numberOfDays: number; 

  @IsOptional()
  @IsString()
  status?: 'pending' | 'approved' | 'rejected';
}
