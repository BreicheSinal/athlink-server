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
import { FederationType } from "./FederationType";

@Entity("federation")
export class Federation {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => FederationType, (federationType) => federationType.id, {
    nullable: true,
  })
  @JoinColumn({ name: "federation_type_id" })
  federationType: FederationType;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  location: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  country: string;

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
  })
  founded_year: number;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;
}
