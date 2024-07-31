import { IsString, IsNumber, IsDateString } from "class-validator";

export class CreateNotificationDto {
    @IsNumber()
    id: number;    

    @IsNumber()
    userId: number;

    @IsString()
    category: string;

    @IsString()
    content: string;

    @IsDateString(
        {},
        { message: 'Published date must be a valid ISO 8601 date string' },
      )
    createdAt: string;
}
