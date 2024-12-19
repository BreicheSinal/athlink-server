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
  id!: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  name!: string;

  @Column({
    type: "enum",
    enum: ["athlete", "coach", "club"],
  })
  category!: "athlete" | "coach" | "club";

  @Column({ type: "bigint" })
  entityId!: number;

  @ManyToOne(() => Federation, (federation) => federation.id)
  @JoinColumn({ name: "federation_id" })
  federation!: Federation;

  @Column({
    type: "enum",
    enum: ["pending", "verified", "rejected"],
  })
  verificationStatus!: "pending" | "verified" | "rejected";

  @CreateDateColumn({ type: "datetime" })
  requestedAt!: Date;

  @Column({
    type: "datetime",
    nullable: true,
  })
  approvedAt?: Date;

  @Column({
    type: "text",
    nullable: true,
  })
  description?: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
