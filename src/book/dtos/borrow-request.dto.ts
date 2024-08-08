import {
  IsNumber,
} from 'class-validator';

export class BorrowRequestDto {
  @IsNumber()
  userId: string;

  @IsNumber()
  bookId: number;

  @IsNumber()
  numberOfDays: number;
}
