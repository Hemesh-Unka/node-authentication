import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Role } from "./Role";

@Entity()
export class Rule {
  // A rule can have multiple roles - True

  @PrimaryGeneratedColumn()
  id: number

  // Account, credentials, items
  @Column()
  resource: string;

  // Create:any, update:owm etc.
  @Column()
  action: string;

  // *, *,!password, !email etc.
  @Column()
  attributes: string;

  @ManyToMany(type => Role, role => role.rules)
  roles: Role[];
}