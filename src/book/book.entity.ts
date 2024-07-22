import {Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({ default: 'available' })
    borrowingStatus: 'available' | 'pending' | 'borrowed';
    // borrowed is equavilent to approved

    @Column({ type: 'timestamp', nullable: true })
    borrowedUntil: Date | null;
}