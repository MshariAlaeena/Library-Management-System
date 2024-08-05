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
      return this.notificationsService.createNotification(
        createNotificationDto,
      );
  }

  // gets all notifications
  @Get()
  findAll() {
    return this.notificationsService.getAllNotifications();
  }

  // gets the notifications of a user by user's id
  @Get(':id')
  findOne(@Param('id') id: number) {
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
