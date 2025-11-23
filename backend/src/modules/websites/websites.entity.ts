import { Entity, Column, BeforeInsert, Index } from "typeorm";
import { generateKSUID } from "../../utils/helper.utils";
import { BaseEntity } from "../database/base-entity";

@Index("IDX_WEBSITE_USER_URL", ["createdBy", "url"], { unique: true })
@Entity("Websites")
export class WebsitesEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  secretKey: string;

  @Column({ type: "timestamp" })
  secretKeyExpiresAt: Date;

  @Column({ type: "timestamp", nullable: true })
  lastScannedAt: Date;

  @BeforeInsert()
  async generateId() {
    if (!this.id) {
      this.id = await generateKSUID("ws");
    }
  }
}
