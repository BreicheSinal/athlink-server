import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

import { Post } from "./Post";
import { User } from "./User";

@Entity("post_comment")
export class PostComment {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => Post, (post) => post.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({
    type: "text",
    nullable: false,
  })
  comment: string;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;
}
