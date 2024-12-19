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

@Entity("post_media")
@Index(["post"])
export class PostMedia {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => Post, (post) => post.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post!: Post;

  @Column({
    type: "enum",
    enum: ["image", "video"],
    nullable: false,
  })
  mediaType!: "image" | "video";

  @Column({
    type: "text",
    nullable: false,
  })
  mediaUrl!: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
}
