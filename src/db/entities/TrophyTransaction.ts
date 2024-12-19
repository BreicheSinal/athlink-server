import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Trophy } from "./Trophy";

@Entity("trophy_transaction")
export class TrophyTransaction {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => Trophy, (trophy) => trophy.id)
  @JoinColumn({ name: "trophy_id" })
  trophy!: Trophy;

  @Column({
    type: "varchar",
    length: 255,
  })
  transactionId!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  blockchainAddress?: string;

  @Column({
    type: "enum",
    enum: ["pending", "confirmed", "failed"],
  })
  status!: "pending" | "confirmed" | "failed";

  @Column({
    type: "json",
    nullable: true,
  })
  additionalInfo?: object;

  @CreateDateColumn({ type: "datetime" })
  timestamp!: Date;
}
