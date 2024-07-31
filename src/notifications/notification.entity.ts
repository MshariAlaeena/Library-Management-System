import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;    

    @Column()
    userId: number;

    @Column()
    category: string;

    @Column()
    content: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
