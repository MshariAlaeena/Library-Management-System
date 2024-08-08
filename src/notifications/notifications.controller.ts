import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpException,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // creates a notification
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createNotificationDto: CreateNotificationDto) {
    try {
      return this.notificationsService.createNotification(
      createNotificationDto,
    );
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      else
        throw new HttpException(
          `Unexpected Error while creating Notification`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }   
  }

  // gets all notifications
  @Get()
  findAll() {
    return this.notificationsService.getAllNotifications();
  }

  // gets the notifications of a user by user's id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.getUserNotifications(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
