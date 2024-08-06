import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
      const Notification = await this.notificationsRepository.findOne({
        where: { content: createNotificationDto.content, category: createNotificationDto.category },
      });

      if (Notification) {
        throw new BadRequestException(
          `Notification with ID ${Notification.id} Exists!`,
        );
      }

      const newNotification = this.notificationsRepository.create(
        createNotificationDto,
      );
      this.notificationsRepository.save(newNotification);
      return newNotification;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await this.notificationsRepository.find();
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await this.notificationsRepository.find({ where: { user: { id: userId }}});
  }

  async markAsRead(id: number): Promise<Notification> {
      const notification = await this.notificationsRepository.findOne({
        where: { id },
      });

      if (!notification)
        throw new BadRequestException(
          `Notification with ID ${id} doesn't exist!`,
        );

      notification.isRead = true;
      return await this.notificationsRepository.save(notification);
  }

  async deleteNotifications(id: number): Promise<Notification> {
      const Notification = await this.notificationsRepository.findOne({
        where: { id },
      });

      if (!Notification)
        throw new BadRequestException(
          `Notification with ID ${id} doesn't exist!`,
        );

      await this.notificationsRepository.delete(id);
      return Notification;
  }

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
