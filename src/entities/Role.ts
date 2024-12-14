import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("role")
export class Role {
  @PrimaryGeneratedColumn("increment", {
    type: "tinyint",
    unsigned: true,
  })
  id!: number;

  @Column({
    type: "varchar",
    length: 50,
    unique: true,
  })
  role_name!: string;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;
}
