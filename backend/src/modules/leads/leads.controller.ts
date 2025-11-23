import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import responseUtils from "src/utils/response.utils";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { AdminAuthGuard } from "src/guards/auth-guard";
import { LeadsService } from "./leads.service";
import { CreateLeadDto, DeleteManyLeadsDto, LeadsQueryDto, UpdateLeadDto } from "./leads.dto";
import { LeadResponse, LeadsListResponse } from "./leads.response";

@ApiTags("Leads")
@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  private getUserId(req: RequestWithUser) {
    return req.user.id;
  }

  // Public endpoint for website form submissions using secret key
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @Post("collect")
  async collect(@Body() dto: CreateLeadDto, @Res() res: Response) {
    try {
      const data = await this.leadsService.collect(dto);
      return responseUtils.success(res, { data, status: StatusCodes.CREATED });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @Post()
  async create(@Req() req: RequestWithUser, @Body() dto: CreateLeadDto, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.leadsService.create(userId, dto);
      return responseUtils.success(res, { data, status: StatusCodes.CREATED });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(LeadsListResponse)
  @Get()
  async findAll(@Req() req: RequestWithUser, @Query() query: LeadsQueryDto, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.leadsService.findAll(userId, query);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(LeadResponse)
  @Get(":id")
  async findOne(@Req() req: RequestWithUser, @Param("id") id: string, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.leadsService.findOne(userId, id);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  @Put(":id")
  async update(@Req() req: RequestWithUser, @Param("id") id: string, @Body() dto: UpdateLeadDto, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.leadsService.update(userId, id, dto);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @UseGuards(AdminAuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  @Delete()
  async deleteMany(@Req() req: RequestWithUser, @Body() dto: DeleteManyLeadsDto, @Res() res: Response) {
    try {
      const userId = this.getUserId(req);
      const data = await this.leadsService.deleteMany(userId, dto.ids);
      return responseUtils.success(res, { data });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}

type ReqUser = { id: string; email: string; name: string };
type RequestWithUser = Request & { user: ReqUser };
