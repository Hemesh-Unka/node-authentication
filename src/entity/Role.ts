import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Rule } from './Rule';

@Entity()
export class Role {
  // A role has multiple rules - True

  @PrimaryGeneratedColumn()
  id: number;

  // Superadmin, client, user, guest
  @Column()
  role_name: string;

  @ManyToMany(type => Rule, rule => rule.roles)
  @JoinTable()
  rules: Rule[];
}