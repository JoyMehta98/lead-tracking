import { Module } from "@nestjs/common";
import { AdminAuthGuard } from "src/guards/auth-guard";
import { WebsitesService } from "./websites.service";
import { WebsitesController } from "./websites.controller";

@Module({
  controllers: [WebsitesController],
  providers: [WebsitesService, AdminAuthGuard],
})
export class WebsitesModule {}
