import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Federation } from "./Federation";

@Entity("trophy")
export class Trophy {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  name: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string | null;

  @Column({
    type: "enum",
    enum: ["athlete", "coach", "club"],
  })
  category: "athlete" | "coach" | "club";

  @Column({ type: "bigint" })
  entity_id: number;

  @ManyToOne(() => Federation, (federation) => federation.id)
  @JoinColumn({ name: "federation_id" })
  federation: Federation;

  @Column({
    type: "enum",
    enum: ["pending", "verified", "rejected"],
  })
  verification_status: "pending" | "verified" | "rejected";

  @CreateDateColumn({ type: "datetime" })
  requested_at: Date;

  @Column({
    type: "datetime",
    nullable: true,
  })
  approved_at: Date | null;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;
}
