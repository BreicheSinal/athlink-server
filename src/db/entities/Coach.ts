import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";

import { User } from "./User";
import { Club } from "./Club";

@Entity("coach")
export class Coach {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Club, (club) => club.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "club_id" })
  club: Club | null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  specialty: string | null;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;
}
