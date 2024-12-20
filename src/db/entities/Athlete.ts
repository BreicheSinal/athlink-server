import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User";
import { Club } from "./Club";

@Entity("athlete")
export class Athlete {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Club, (club) => club.id, { nullable: true })
  @JoinColumn({ name: "club_id" })
  club: Club | null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  position: string | null;

  @Column({
    type: "int",
    nullable: true,
  })
  age: number | null;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  height: number | null;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  weight: number | null;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;
}
