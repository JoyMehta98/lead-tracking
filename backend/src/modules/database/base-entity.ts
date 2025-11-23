import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import type { UsersEntity } from "../users/users.entity";

export class BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @ManyToOne("UsersEntity", { nullable: true })
  @JoinColumn({ name: "createdBy" })
  creator?: UsersEntity;

  @Column({ nullable: true })
  updatedBy?: string;

  @ManyToOne("UsersEntity", { nullable: true })
  @JoinColumn({ name: "updatedBy" })
  updater?: UsersEntity;
}
