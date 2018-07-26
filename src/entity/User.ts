import * as bcrypt from 'bcryptjs';

import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Generated } from "typeorm";
import { IsEmail } from "class-validator";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated('uuid')
    uuid: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ select: true })
    password: string;

    @Column({ nullable: true })
    access_token: string;

    @BeforeInsert()
    async hashAndSaltPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async validatePassword(plainTextPassword: string) {
        try {
            return await bcrypt.compare(plainTextPassword, this.password)
        } catch (error) {
            throw new Error(error);
        }
    }
}