import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import responseUtils from "src/utils/response.utils";
import { clearCookies, setAuthToken, setRefreshToken } from "src/utils/cookies.utils";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "./auth.dto";
import { AuthHelperService } from "./auth.helper.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  private readonly authHelper = new AuthHelperService();
  constructor(private readonly authService: AuthService) {}

  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @Post("signup")
  async signup(@Res() res: Response, @Body() dto: SignupDto) {
    try {
      const { message, authToken, refreshToken } = await this.authService.signup(dto);

      setAuthToken(res, authToken);
      setRefreshToken(res, refreshToken);

      return responseUtils.success(res, { data: { message }, status: StatusCodes.CREATED });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Post("login")
  async login(@Res() res: Response, @Body() dto: LoginDto) {
    try {
      const { message, authToken, refreshToken } = await this.authService.login(dto);

      setAuthToken(res, authToken);
      setRefreshToken(res, refreshToken);

      return responseUtils.success(res, { data: { message } });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Post("logout")
  async logout(@Res() res: Response) {
    try {
      clearCookies(res);
      return responseUtils.success(res, { data: { message: "Logged out" } });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Post("refresh")
  async refresh(@Res() res: Response) {
    try {
      // read refresh cookie and issue new auth token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const refreshToken = (res.req as any)?.cookies?.refreshToken as string | undefined;
      const newAuthToken = this.authHelper.refreshToken(refreshToken);

      setAuthToken(res, newAuthToken);

      return responseUtils.success(res, { data: { message: "Token refreshed" } });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
