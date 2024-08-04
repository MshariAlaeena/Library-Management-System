import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsString()
  category: string;

  @IsString()
  content: string;
}
