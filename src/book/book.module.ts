import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './book.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { Borrow } from './borrow.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), TypeOrmModule.forFeature([Borrow]), AuthModule, NotificationsModule],
  providers: [BookService, JwtAuthGuard],
  controllers: [BookController],
})
export class BookModule {}
