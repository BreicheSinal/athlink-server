import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Role } from "./Role";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn({
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  password!: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: "tinyint",
    unsigned: true,
  })
  role_id!: number;

  @ManyToOne(() => Role, (role) => role.id, { eager: true })
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @Column({
    type: "text",
    nullable: true,
  })
  bio?: string;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;
}
