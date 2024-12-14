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

  @CreateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
