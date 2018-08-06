import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";

import { Rule } from './Rule';
import { User } from "./User";

@Entity()
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role_name: string;

  @OneToMany(type => User, user => user.role)
  users: User[];

  @ManyToMany(type => Rule, rule => rule.roles)
  @JoinTable()
  rules: Rule[];
}