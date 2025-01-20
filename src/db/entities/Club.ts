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
import { Federation } from "./Federation";

@Entity("club")
export class Club {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Federation, (federation) => federation.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "federation_id" })
  federation: Federation | null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  location: string | null;

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
  })
  founded_year: number | null;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;
}
