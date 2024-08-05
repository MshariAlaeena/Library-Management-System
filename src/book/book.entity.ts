import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
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

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
