import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

import { Chat } from "./Chat";
import { User } from "./User";

@Entity("chat_message")
@Index("chat_id_index", ["chat_id"])
@Index("sender_id_index", ["sender_id"])
export class ChatMessage {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => Chat, (chat) => chat.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "chat_id" })
  chat!: Chat;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sender_id" })
  sender!: User;

  @Column("text")
  message!: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
}
