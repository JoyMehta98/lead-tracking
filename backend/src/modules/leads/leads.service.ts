import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { transformToInstance } from "src/utils/helper.utils";
import { CreateLeadDto, LeadsQueryDto, UpdateLeadDto } from "./leads.dto";
import { LeadResponse, LeadsListResponse } from "./leads.response";
import { LeadsEntity } from "./leads.entity";
import { WebsitesEntity } from "../websites/websites.entity";
import { WebsiteFormsEntity } from "../websites/websites.forms.entity";

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(LeadsEntity)
    private readonly leadsRepository: Repository<LeadsEntity>,
    @InjectRepository(WebsitesEntity)
    private readonly websitesRepository: Repository<WebsitesEntity>,
    @InjectRepository(WebsiteFormsEntity)
    private readonly formsRepository: Repository<WebsiteFormsEntity>,
  ) {}

  private async validateWebsiteForUser(userId: string, websiteId: string): Promise<WebsitesEntity> {
    const website = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.id = :websiteId", { websiteId })
      .andWhere("website.createdBy = :userId", { userId })
      .getOne();

    if (!website) throw new NotFoundException("Website not found");
    if (!website.isActive) throw new BadRequestException("Website is not active");
    return website;
  }

  private async resolveFormIdByName(websiteId: string, formName: string): Promise<string> {
    const form = await this.formsRepository
      .createQueryBuilder("form")
      .where("form.websiteId = :websiteId", { websiteId })
      .andWhere("form.name = :formName", { formName })
      .getOne();
    if (!form) throw new NotFoundException("Form not found for this website");
    return form.id;
  }

  private async validateWebsiteBySecret(websiteId: string, secretKey?: string): Promise<WebsitesEntity> {
    const website = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.id = :websiteId", { websiteId })
      .andWhere("website.secretKey = :secretKey", { secretKey })
      .getOne();
    if (!website) throw new NotFoundException("Invalid website or secret key");
    if (!website.isActive) throw new BadRequestException("Website is not active");
    if (website.secretKeyExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException("Secret key expired");
    }
    return website;
  }

  async create(userId: string, dto: CreateLeadDto): Promise<{ message: string }> {
    await this.validateWebsiteForUser(userId, dto.websiteId);
    const formId = await this.resolveFormIdByName(dto.websiteId, dto.formName);

    const entity = this.leadsRepository.create({
      websiteId: dto.websiteId,
      formId,
      data: dto.fields as Record<string, unknown>,
      meta: dto.meta as Record<string, unknown> | undefined,
      createdBy: userId,
    });
    await this.leadsRepository.save(entity);
    return { message: SUCCESS_MESSAGES.CREATED };
  }

  async collect(dto: CreateLeadDto): Promise<{ message: string }> {
    await this.validateWebsiteBySecret(dto.websiteId, dto.secretKey);
    const formId = await this.resolveFormIdByName(dto.websiteId, dto.formName);

    const entity = this.leadsRepository.create({
      websiteId: dto.websiteId,
      formId,
      data: dto.fields as Record<string, unknown>,
      meta: dto.meta as Record<string, unknown> | undefined,
    });
    await this.leadsRepository.save(entity);
    return { message: SUCCESS_MESSAGES.CREATED };
  }

  async findAll(userId: string, query: LeadsQueryDto): Promise<LeadsListResponse> {
    const {
      page = 1,
      limit = 20,
      sort = "createdAt",
      order = "DESC",
      search,
      field,
      isPagination = true,
      websiteId,
      formId,
    } = query;

    const qb = this.leadsRepository.createQueryBuilder("lead");

    if (websiteId) qb.andWhere("lead.websiteId = :websiteId", { websiteId });
    if (formId) qb.andWhere("lead.formId = :formId", { formId });
    if (search && field) {
      qb.andWhere(`lead.data->>'${field}' ILIKE :search`, { search: `%${search}%` });
    }

    qb.orderBy(`lead.${sort}`, order === "ASC" ? "ASC" : "DESC");

    if (isPagination) qb.skip((page - 1) * limit).take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      data: rows.map((r) => transformToInstance(LeadResponse, r)),
      total,
      page: isPagination ? page : 1,
      limit: isPagination ? limit : total,
      totalPages: isPagination ? Math.ceil(total / limit) : 1,
    };
  }

  async findOne(userId: string, id: string): Promise<LeadResponse> {
    const record = await this.leadsRepository
      .createQueryBuilder("lead")
      .where("lead.id = :id", { id })
      .andWhere("lead.createdBy = :userId", { userId })
      .getOne();

    return transformToInstance(LeadResponse, record);
  }

  async update(userId: string, id: string, dto: UpdateLeadDto): Promise<{ message: string }> {
    const existing = await this.leadsRepository
      .createQueryBuilder("lead")
      .where("lead.id = :id", { id })
      .andWhere("lead.createdBy = :userId", { userId })
      .getOne();
    if (!existing) return { message: SUCCESS_MESSAGES.UPDATED };

    const patch: Partial<LeadsEntity> & { updatedBy?: string } = {};
    if (dto.websiteId) {
      await this.validateWebsiteForUser(userId, dto.websiteId);
      patch.websiteId = dto.websiteId;
    }
    if (dto.fields) patch.data = dto.fields as Record<string, unknown>;
    if (typeof dto.meta !== "undefined") patch.meta = dto.meta as Record<string, unknown> | undefined;
    patch.updatedBy = userId;

    if (Object.keys(patch).length > 1) {
      await this.leadsRepository.update(id, patch as AnyType);
    }
    return { message: SUCCESS_MESSAGES.UPDATED };
  }

  async deleteMany(userId: string, ids: string[]): Promise<{ message: string }> {
    const records = await this.leadsRepository
      .createQueryBuilder("lead")
      .where("lead.id IN (:...ids)", { ids })
      .andWhere("lead.createdBy = :userId", { userId })
      .getMany();

    if (records.length) await this.leadsRepository.remove(records);
    return { message: SUCCESS_MESSAGES.DELETED };
  }
}
