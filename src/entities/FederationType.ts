import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("federation_type")
export class FederationType {
  @PrimaryGeneratedColumn({
    type: "int",
    unsigned: true,
  })
  id!: number;

  @Column({
    type: "varchar",
    length: 100,
  })
  type_name!: string;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;
}
