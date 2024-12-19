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

@Entity("post")
@Index(["user"])
export class Post {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({
    type: "text",
    nullable: true,
  })
  description?: string;

  @Column({
    type: "int",
    unsigned: true,
    default: 0,
  })
  likesCount!: number;

  @Column({
    type: "int",
    unsigned: true,
    default: 0,
  })
  commentsCount!: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
