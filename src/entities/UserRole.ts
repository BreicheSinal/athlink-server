import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "./User";
import { Role } from "./Role";

@Entity("user_role")
export class UserRole {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @ManyToOne(() => User, (user) => user.userRoles, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user!: User;

  @Column()
  user_id!: number;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    nullable: false,
    onDelete: "CASCADE",
  })
  role!: Role;

  @Column()
  role_id!: number;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;
}
