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
export class PostMedia {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => Post, (post) => post.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @Column({
    type: "enum",
    enum: ["image", "video"],
    nullable: false,
  })
  media_type: "image" | "video";

  @Column({
    type: "text",
    nullable: false,
  })
  media_url: string;

  @Column({
    type: "text",
    nullable: false,
  })
  storage_path: string;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;
}
