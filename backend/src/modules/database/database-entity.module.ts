import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "../users/users.entity";
import { WebsiteFormsEntity } from "../websites/websites.forms.entity";
import { WebsitesEntity } from "../websites/websites.entity";
import { LeadsEntity } from "../leads/leads.entity";

const entities = TypeOrmModule.forFeature([UsersEntity, WebsitesEntity, WebsiteFormsEntity, LeadsEntity]);

@Global()
@Module({
  imports: [entities],
  exports: [entities],
})
export class DatabaseEntityModule {}
