import { Borrow } from 'src/book/borrow.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Notification } from 'src/notifications/notification.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 40, unique: true, name: "username"})
  username: string;

  @Column({ name: "password" })
  password: string;

  @Column({ default: 'user', name: "role" })
  role: string;

  @OneToMany(() => Borrow, borrow => borrow.book)
  borrows: Borrow[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: "updated_at" })
  updatedAt: Date;
}
