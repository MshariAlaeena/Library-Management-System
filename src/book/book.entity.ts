import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Borrow } from './borrow.entity';
import { IsPositive } from 'class-validator';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 50 })
  title: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  author: string;

  @Column()
  publishedDate: Date;

  @Column({ nullable: true })
  isbn: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  availableCopies: number;

  @OneToMany(() => Borrow, borrow => borrow.book)
  borrows: Borrow[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
