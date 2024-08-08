import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: "user_id"})
  userId: string;

  @Column({ name: "category" })
  category: string;

  @Column({ name: "content" })
  content: string;

  @Column({ default: false, name: "is_read"})
  isRead: boolean;

  @ManyToOne(() => User, user => user.notifications)
  user: User;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: "created_at" })
  createdAt: Date;
}
