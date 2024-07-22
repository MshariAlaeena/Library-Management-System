import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {

  @IsNotEmpty({ message: 'Title must not be empty!'})
  @IsString()
  title: string;

  @IsDateString({}, { message: 'Published date must be a valid ISO 8601 date string' })
  publishedDate: string;
}
