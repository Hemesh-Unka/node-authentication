import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Role } from "./Role";

@Entity()
export class Rule {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  resource: string;

  @Column()
  action: string;

  @Column()
  attributes: string;

  @ManyToMany(type => Role, role => role.rules)
  roles: Role[];
}