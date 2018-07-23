import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, Length } from "class-validator";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ select: false})
    @Length(6)
    password: string;
}