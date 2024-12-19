import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Agent } from "./Agent";
import { Athlete } from "./Athlete";

@Entity("agent_athlete")
@Unique(["agent", "athlete"])
export class AgentAthlete {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    unsigned: true,
  })
  id!: number;

  @ManyToOne(() => Agent, (agent) => agent.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "agent_id" })
  agent!: Agent;

  @ManyToOne(() => Athlete, (athlete) => athlete.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "athlete_id" })
  athlete!: Athlete;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
