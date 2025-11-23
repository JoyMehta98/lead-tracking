import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { generateKSUID } from "../../utils/helper.utils";
import { BaseEntity } from "../database/base-entity";
import { WebsitesEntity } from "../websites/websites.entity";
import { WebsiteFormsEntity } from "../websites/websites.forms.entity";

@Entity("Leads")
export class LeadsEntity extends BaseEntity {
  @Column()
  websiteId: string;

  @ManyToOne(() => WebsitesEntity, { nullable: false })
  @JoinColumn({ name: "websiteId" })
  website: WebsitesEntity;

  @Column()
  formId: string;

  @ManyToOne(() => WebsiteFormsEntity, { nullable: false })
  @JoinColumn({ name: "formId" })
  form: WebsiteFormsEntity;

  @Column({ type: "jsonb", default: () => "'{}'" })
  data: Record<string, unknown>;

  @Column({ type: "jsonb", nullable: true })
  meta?: Record<string, unknown>;

  @BeforeInsert()
  async generateId() {
    if (!this.id) {
      this.id = await generateKSUID("ld");
    }
  }
}
