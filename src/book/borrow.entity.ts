import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Book } from '../book/book.entity';

@Entity({ name: 'borrows' })
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.borrows)
  user: User;

  @ManyToOne(() => Book, book => book.borrows)
  book: Book;

  @Column()
  userId: string;

  @Column()
  borrowDate: Date;

  @Column()
  dueDate: Date;

  @Column()
  status: string;
}
