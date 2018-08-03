import * as bcrypt from 'bcryptjs';

import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Generated, ManyToOne } from "typeorm";
import { IsEmail } from "class-validator";

import { Role } from './Role';

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

    @Column()
    password: string;

    @ManyToOne(type => Role, role => role.users, { cascade: true })
    role: Role;

    @BeforeInsert()
    async hashAndSaltPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @BeforeUpdate()
    async updateHashAndSaltPassword() {
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