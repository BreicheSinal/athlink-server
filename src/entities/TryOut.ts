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

import { Club } from "./Club";

@Entity("try_out")
export class TryOut {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => Club, (club) => club.id)
  @JoinColumn({ name: "club_id" })
  club!: Club;

  @Column({
    type: "varchar",
    length: 255,
  })
  name!: string;

  @Column({
    type: "datetime",
  })
  date!: Date;

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
