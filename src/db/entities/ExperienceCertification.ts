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
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: "enum",
    enum: ["experience", "certification"],
    nullable: false,
  })
  type: "experience" | "certification";

  @Column({
    type: "date",
    nullable: false,
  })
  date: string;

  @Column({
    type: "text",
  })
  description: string | null;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;
}
