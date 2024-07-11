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
}