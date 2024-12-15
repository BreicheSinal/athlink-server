import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

import { User } from "./User";

@Entity("experience_certification")
export class ExperienceCertification {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({
    type: "varchar",
    length: 255,
  })
  name!: string;

  @Column({
    type: "enum",
    enum: ["experience", "certification"],
  })
  type!: "experience" | "certification";

  @Column({
    type: "varchar",
    length: 255,
  })
  date!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description?: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
