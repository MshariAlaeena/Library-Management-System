import { Borrow } from 'src/book/borrow.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Notification } from 'src/notifications/notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Borrow, borrow => borrow.book)
  borrows: Borrow[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp' , nullable: true})
  updatedAt: Date;
}
