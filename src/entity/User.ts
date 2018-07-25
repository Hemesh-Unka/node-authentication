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
}

// TODO: This code is not working, it seems like it only makes a commit and does not start any transactions
//     @AfterInsert()
//     genAuthToken() {
//         const expiresIn = 60 * 60;
//         const access = 'auth';
//         const secretOrKey = process.env.SECRET
//         const token = await jwt.sign({ uuid: this.uuid, access }, secretOrKey, { expiresIn: expiresIn });
//     }
// }