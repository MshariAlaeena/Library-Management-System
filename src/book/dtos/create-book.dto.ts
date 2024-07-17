import { IsString, IsDateString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsDateString()
  publishedDate: string;
}
