import {Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    photoUrl: string;

    @Column()
    author: string;

    @Column()
    publishedDate: Date;

    @Column()
    isbn: number;

    @Column()
    summary: string;

    @Column()
    availableCopies: number;

    @Column({ default: 'available' })
    borrowingStatus: 'available' | 'pending' | 'borrowed';
    // borrowed is equavilent to approved

    @Column({ type: 'timestamp', nullable: true })
    borrowedUntil: Date | null;
}