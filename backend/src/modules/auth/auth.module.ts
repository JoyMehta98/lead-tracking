import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthHelperService } from "./auth.helper.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthHelperService],
})
export class AuthModule {}
