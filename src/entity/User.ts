import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Generated, AfterInsert } from "typeorm";
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

    @Column()
    password: string;

    @Column({ nullable: true })
    access_token: string;

    @BeforeInsert()
    async hashAndSaltPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @BeforeInsert()
    async genAuthToken() {
        const expiresIn = 60 * 60;
        const access = 'auth';
        const secretOrKey = process.env.SECRET

        this.access_token = await jwt.sign({ uuid: this.uuid, access }, secretOrKey, { expiresIn: expiresIn });
    }
}