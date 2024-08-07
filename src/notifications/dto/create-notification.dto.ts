import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  userId: string;

  @IsString()
  category: string;

  @IsString()
  content: string;
}
