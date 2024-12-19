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

import { Athlete } from "./Athlete";
import { TryOut } from "./TryOut";

@Entity("athlete_try_out_application")
export class AthleteTryOutApplication {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => Athlete, (athlete) => athlete.id)
  @JoinColumn({ name: "athlete_id" })
  athlete!: Athlete;

  @ManyToOne(() => TryOut, (tryOut) => tryOut.id)
  @JoinColumn({ name: "try_out_id" })
  tryOut!: TryOut;

  @Column({
    type: "enum",
    enum: ["pending", "accepted", "rejected"],
  })
  status!: "pending" | "accepted" | "rejected";

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
