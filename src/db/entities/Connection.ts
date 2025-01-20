import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { User } from "./User";

@Entity("connection")
export class Connection {
  @PrimaryColumn({ type: "bigint", unsigned: true })
  user_id!: number;

  @PrimaryColumn({ type: "bigint", unsigned: true })
  connected_user_id!: number;

  @Column({
    type: "enum",
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  })
  status!: "pending" | "accepted" | "rejected";

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "connected_user_id" })
  connectedUser!: User;
}
