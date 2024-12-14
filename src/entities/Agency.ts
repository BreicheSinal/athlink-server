import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  import { User } from "./User";
  
  @Entity("agency")
  export class Agency {
    @PrimaryGeneratedColumn("increment", {
      type: "bigint",
      unsigned: true,
    })
    id!: number;
  
    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "user_id" })
    user!: User;
  
    @Column({
      type: "varchar",
      length: 255,
      nullable: true,
    })
    location?: string;
  
    @Column({
      type: "int",
      nullable: true,
    })
    foundedYear?: number;
  
    @CreateDateColumn({ type: "datetime" })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: "datetime" })
    updatedAt!: Date;
  }
  