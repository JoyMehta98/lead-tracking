import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { WebsitesModule } from "./modules/websites/websites.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { DatabaseEntityModule } from "./modules/database/database-entity.module";

@Module({
  imports: [DatabaseModule, DatabaseEntityModule, AuthModule, WebsitesModule, LeadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
