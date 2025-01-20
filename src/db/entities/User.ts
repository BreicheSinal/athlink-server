import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { UserRole } from "./UserRole";

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
    nullable: false,
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    select: false,
  })
  password!: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({ type: "text", nullable: true })
  bio?: string;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles!: UserRole[];
}
