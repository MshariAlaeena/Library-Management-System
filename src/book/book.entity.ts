import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Borrow } from './borrow.entity';
import { IsPositive } from 'class-validator';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 50, name: "title" })
  title: string;

  @Column({ nullable: true, name: "photo_url"})
  photoUrl: string;

  @Column({ nullable: true, name: "author" })
  author: string;

  @Column({name: "published_date"})
  publishedDate: Date;
2
  @Column({ nullable: true, name: "isbn" })
  isbn: string;

  @Column({ nullable: true, name: "summary" })
  summary: string;

  @Column({ nullable: true, name: "available_copies" })
  availableCopies: number;

  @OneToMany(() => Borrow, borrow => borrow.book)
  borrows: Borrow[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: "updated_at" })
  updatedAt: Date;
}
