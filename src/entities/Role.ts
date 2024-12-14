import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { UserRole } from "./UserRole";

@Entity("role")
export class Role {
  @PrimaryGeneratedColumn("increment", {
    type: "tinyint",
    unsigned: true,
  })
  id!: number;

  @Column({
    type: "varchar",
    length: 50,
    unique: true,
    nullable: false,
  })
  role_name!: string;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles!: UserRole[];
}
