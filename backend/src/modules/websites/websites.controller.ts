import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import responseUtils from "src/utils/response.utils";
import { AdminAuthGuard } from "src/guards/auth-guard";
import { WebsitesListResponse, WebsitesResponse } from "./websites.response";
import { WebsitesService } from "./websites.service";
import { CreateWebsiteDto, DeleteManyWebsitesDto, UpdateWebsiteDto, WebsitesQueryDto } from "./websites.dto";
import { SaveWebsiteFormsDto, DetectFormsDto } from "./websites.forms.dto";
import { ApiSwaggerResponse } from "../swagger/swagger.decorator";
import { MessageResponse } from "../swagger/dtos/response.dtos";

@ApiTags("Websites")
@Controller("websites")
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  // local request type to access user injected by AdminAuthGuard
  private getUserId(req: RequestWithUser) {
    return req.user.id;
  }

  // --------- FORMS: SCAN, SAVE, LIST ---------
  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  @Post("detect-forms")
  async detectForms(@Body() dto: DetectFormsDto, @Res() res: Response) {
    try {
      const data = await this.websitesService.detectFormsFromInput({ html: dto.html, url: dto.url });
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  @Post(":id/scan")
  async scan(@Req() req: RequestWithUser, @Param("id") id: string, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.websitesService.scanUrl(userId, id);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  @Post(":id/forms")
  async saveForms(
    @Req() req: RequestWithUser,
    @Param("id") id: string,
    @Body() dto: SaveWebsiteFormsDto,
    @Res() res: Response,
  ) {
    try {
      const userId = this.getUserId(req);
      const data = await this.websitesService.saveForms(userId, id, dto.forms);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  @Get(":id/forms")
  async listForms(@Req() req: RequestWithUser, @Param("id") id: string, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.websitesService.listForms(userId, id);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @Post()
  async create(@Req() req: RequestWithUser, @Res() res: Response, @Body() dto: CreateWebsiteDto) {
    try {
      const userId = this.getUserId(req);
      const data = await this.websitesService.create(userId, dto);
      return responseUtils.success(res, {
        data,
        status: StatusCodes.CREATED,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(WebsitesListResponse)
  @Get()
  async findAll(@Req() req: RequestWithUser, @Query() query: WebsitesQueryDto, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.websitesService.findAll(userId, query);

      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(WebsitesResponse)
  @Get(":id")
  async findOne(@Req() req: RequestWithUser, @Param("id") id: string, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.websitesService.findOne(userId, id);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  @Put(":id")
  async update(
    @Req() req: RequestWithUser,
    @Param("id") id: string,
    @Body() dto: UpdateWebsiteDto,
    @Res() res: Response,
  ) {
    try {
      const userId = this.getUserId(req);
      const data = await this.websitesService.update(userId, id, dto);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  @Delete()
  async deleteMany(@Req() req: RequestWithUser, @Body() dto: DeleteManyWebsitesDto, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.websitesService.deleteMany(userId, dto.ids);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}

type ReqUser = { id: string; email: string; name: string };
type RequestWithUser = Request & { user: ReqUser };
