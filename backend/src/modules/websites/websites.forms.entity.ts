import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { WebsitesEntity } from "./websites.entity";
import { generateKSUID } from "../../utils/helper.utils";
import { BaseEntity } from "../database/base-entity";

@Entity("WebsiteForms")
export class WebsiteFormsEntity extends BaseEntity {
  @Column()
  websiteId: string;

  @ManyToOne(() => WebsitesEntity, { nullable: false })
  @JoinColumn({ name: "websiteId" })
  website: WebsitesEntity;

  @Column()
  name: string;

  @Column({ nullable: true })
  action?: string;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  selector?: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  fields: Array<{
    name: string;
    type?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
  }>;

  @BeforeInsert()
  async generateId() {
    if (!this.id) {
      this.id = await generateKSUID("wf");
    }
  }
}
