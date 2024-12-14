import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

import { User } from "./User";

@Entity("chats")
@Index(["user_id_1", "user_id_2"])
export class Chat {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id_1" })
  user1!: User;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id_2" })
  user2!: User;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
}
