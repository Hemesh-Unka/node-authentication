import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { IsEmail } from "class-validator";
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashAndSaltPassword() {
        console.log('This hashing the password');
        this.password = await bcrypt.hash(this.password, 10);
    }
}