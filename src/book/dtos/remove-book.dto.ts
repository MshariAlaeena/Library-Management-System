import { IsNumber } from 'class-validator';

export class removeBookDto {
  @IsNumber({}, { message: 'invalid input, ID must be number' })
  id: number;
}
