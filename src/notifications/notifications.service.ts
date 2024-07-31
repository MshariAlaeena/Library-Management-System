import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private userService: UserService
  ) {}


  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const Notification = await this.notificationsRepository.findOne({ where: { id: createNotificationDto.id }});

    if (Notification) {
      throw new BadRequestException(`Notification with ID ${createNotificationDto.id} Exists!`);
    }

    const newNotification = this.notificationsRepository.create(createNotificationDto);
    return newNotification;

  }
  
  async getNotifications(userId: number): Promise<Notification[]> {
    return await this.notificationsRepository.find({ where: { userId } });
  }

  async markAsRead(id: number): Promise<Notification> {
    try {
      const notification = await this.notificationsRepository.findOne({ where: { id }});

      if(!notification)
        throw new BadRequestException(`Notification with ID ${id} doesn't exist!`);

      notification.isRead = true;
      return await this.notificationsRepository.save(notification);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {

      }
    }
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
