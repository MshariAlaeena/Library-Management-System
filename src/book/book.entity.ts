import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Borrow } from './borrow.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  title: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  author: string;

  @Column()
  publishedDate: Date;

  @Column({ nullable: true })
  isbn: number;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  availableCopies: number;

  @OneToMany(() => Borrow, borrow => borrow.book)
  borrows: Borrow[];

  @Column()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
