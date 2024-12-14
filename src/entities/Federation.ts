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
  @PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true })
  id!: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => FederationType, (federationType) => federationType.id)
  @JoinColumn({ name: "federation_type_id" })
  federationType!: FederationType;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  location?: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  country?: string;

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
  })
  foundedYear?: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
