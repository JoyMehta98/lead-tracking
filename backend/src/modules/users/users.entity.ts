import { Entity, Column, BeforeInsert } from "typeorm";
import { generateKSUID } from "../../utils/helper.utils";
import { BaseEntity } from "../database/base-entity";

@Entity("Users")
export class UsersEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async generateId() {
    if (!this.id) {
      this.id = await generateKSUID("us");
    }
  }
}
