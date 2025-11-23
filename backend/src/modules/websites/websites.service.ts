import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import CryptoJS from "crypto-js";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { transformToInstance } from "src/utils/helper.utils";
import { load, type CheerioAPI } from "cheerio";
import { WebsitesEntity } from "./websites.entity";
import { WebsitesListResponse, WebsitesResponse, WebsiteResponse } from "./websites.response";
import { CreateWebsiteDto, UpdateWebsiteDto, WebsitesQueryDto } from "./websites.dto";
import { WebsiteFormsEntity } from "./websites.forms.entity";
import { LeadsEntity } from "../leads/leads.entity";

type DetectedField = { name: string; type?: string; label?: string; placeholder?: string; required?: boolean };
type DetectedForm = { name: string; action?: string; method?: string; selector?: string; fields: DetectedField[] };

@Injectable()
export class WebsitesService {
  constructor(
    @InjectRepository(WebsitesEntity)
    private readonly websitesRepository: Repository<WebsitesEntity>,
    @InjectRepository(WebsiteFormsEntity)
    private readonly formsRepository: Repository<WebsiteFormsEntity>,
    @InjectRepository(LeadsEntity)
    private readonly leadsRepository: Repository<LeadsEntity>,
  ) {}

  async create(userId: string, dto: CreateWebsiteDto): Promise<{ message: string }> {
    // optional friendly uniqueness check
    const exists = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.createdBy = :userId", { userId })
      .andWhere("website.url = :url", { url: dto.url })
      .getOne();
    if (exists) {
      return { message: SUCCESS_MESSAGES.CREATED }; // idempotent
    }

    const secretKey = CryptoJS.lib.WordArray.random(32).toString();
    const secretKeyExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const entity = this.websitesRepository.create({ ...dto, createdBy: userId, secretKey, secretKeyExpiresAt });
    await this.websitesRepository.save(entity);
    return { message: SUCCESS_MESSAGES.CREATED };
  }

  async findAll(userId: string, query: WebsitesQueryDto): Promise<WebsitesListResponse> {
    const {
      page = 1,
      limit = 20,
      sort = "createdAt",
      order = "DESC",
      search,
      isPagination = true,
      isActive,
      websiteId,
    } = query;

    const formsSubQuery = this.formsRepository
      .createQueryBuilder("form")
      .select("COUNT(form.id)", "formsCount")
      .where(websiteId ? "form.websiteId = :websiteId" : "form.websiteId = website.id", { websiteId })
      .getQuery();

    const leadsSubQuery = this.leadsRepository
      .createQueryBuilder("lead")
      .select("COUNT(lead.id)", "leadsCount")
      .where(websiteId ? "lead.websiteId = :websiteId" : "lead.websiteId = website.id", { websiteId })
      .getQuery();

    const qb = this.websitesRepository
      .createQueryBuilder("website")
      .select([
        "website.id",
        "website.name",
        "website.url",
        "website.secretKey",
        "website.isActive",
        "website.createdAt",
        "website.updatedAt",
        "website.lastScannedAt",
      ])
      .addSelect(`(${formsSubQuery})`, "formsCount")
      .addSelect(`(${leadsSubQuery})`, "leadsCount")
      .where("website.createdBy = :userId", { userId })
      .andWhere(websiteId ? "website.id = :websiteId" : "1=1", { websiteId });

    if (search) {
      qb.andWhere("(website.name ILIKE :search OR website.url ILIKE :search)", {
        search: `%${search}%`,
      });
    }

    if (typeof isActive === "boolean") {
      qb.andWhere("website.isActive = :isActive", { isActive });
    }

    qb.orderBy(`website.${sort}`, order === "ASC" ? "ASC" : "DESC");

    if (isPagination) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [rows, total] = await Promise.all([qb.getRawMany(), qb.getCount()]);

    // Map the raw results to include the counts
    const mappedRows = rows.map((row) => {
      // const website = raw.website || rows[index]; // Handle raw vs entity
      return {
        id: row.website_id,
        name: row.website_name,
        url: row.website_url,
        secretKey: row.website_secretKey,
        isActive: row.website_isActive,
        createdAt: row.website_createdAt,
        updatedAt: row.website_updatedAt,
        lastScannedAt: row.website_lastScannedAt,
        totalLeads: parseInt(row.leadsCount) || 0,
        formsDetected: parseInt(row.formsCount) || 0,
      };
    });

    return {
      // @ts-expect-error need to check
      data: transformToInstance(WebsitesResponse, mappedRows),
      total,
      page: isPagination ? page : 1,
      limit: isPagination ? limit : total,
      totalPages: isPagination ? Math.ceil(total / limit) : 1,
    };
  }

  async findOne(userId: string, id: string): Promise<WebsiteResponse> {
    const record = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.id = :id", { id })
      .andWhere("website.createdBy = :userId", { userId })
      .getOne();

    return transformToInstance(WebsiteResponse, record);
  }

  async update(userId: string, id: string, dto: UpdateWebsiteDto): Promise<{ message: string }> {
    const existing = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.id = :id", { id })
      .andWhere("website.createdBy = :userId", { userId })
      .getOne();

    if (!existing) {
      return { message: SUCCESS_MESSAGES.UPDATED }; // No-op if not found for the user
    }

    await this.websitesRepository.update(id, { ...dto, updatedBy: userId });
    return { message: SUCCESS_MESSAGES.UPDATED };
  }

  async deleteMany(userId: string, ids: string[]): Promise<{ message: string }> {
    const records = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.id IN (:...ids)", { ids })
      .andWhere("website.createdBy = :userId", { userId })
      .getMany();

    if (records.length) {
      await this.websitesRepository.remove(records);
    }
    return { message: SUCCESS_MESSAGES.DELETED };
  }

  // ---------- FORMS: SCAN, SAVE, LIST ----------
  async scanUrl(userId: string, id: string): Promise<DetectedForm[]> {
    const website = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.id = :id", { id })
      .andWhere("website.createdBy = :userId", { userId })
      .getOne();

    if (!website) {
      throw new Error("Website not found");
    }

    const res = await fetch(website.url, { redirect: "follow" });
    const html = await res.text();
    const forms = this.parseHtmlToForms(html);

    await this.websitesRepository.update({ id }, { lastScannedAt: new Date() });

    return forms;
  }

  // Parse a block of HTML into structured form definitions
  private parseHtmlToForms(html: string): DetectedForm[] {
    const $: CheerioAPI = load(html);
    const forms: DetectedForm[] = [];
    $("form").each((idx, el) => {
      const form = $(el);
      const action = form.attr("action") || undefined;
      const method = (form.attr("method") || "").toUpperCase() || undefined;
      const name = form.attr("name") || form.attr("id") || `form_${idx + 1}`;
      const selector = form.attr("id") ? `#${form.attr("id")}` : `form:eq(${idx})`;

      const fields: DetectedField[] = [];
      form.find("input, select, textarea").each((i, fieldEl) => {
        const elem = $(fieldEl);
        const attr = (n: string) => (elem as unknown as { attr: (x: string) => string | undefined }).attr(n);
        const prop = (n: string) => (elem as unknown as { prop: (x: string) => unknown }).prop(n);
        const prevEl = (sel: string) => (elem as unknown as { prev: (s: string) => ReturnType<typeof $> }).prev(sel);
        const isEl = (sel: string) => (elem as unknown as { is: (s: string) => boolean }).is(sel);

        const nameAttr = attr("name") || `field_${i + 1}`;
        if (!nameAttr) return;
        const type = attr("type") || String((prop("tagName") as string | undefined) || "").toLowerCase();
        const id = attr("id");
        let label = attr("aria-label");
        if (!label && id) {
          const lbl = $(`label[for='${id}']`).first();
          if (lbl.length) label = lbl.text().trim() || undefined;
        }
        if (!label) {
          const prevLbl = prevEl("label");
          if (prevLbl.length) label = prevLbl.text().trim() || undefined;
        }
        const placeholder = attr("placeholder") || undefined;
        const required = isEl("[required]") || false;
        fields.push({ name: nameAttr, type, label, placeholder, required });
      });

      forms.push({ name, action, method, selector, fields });
    });
    return forms;
  }

  // Generic detector from either raw HTML or a URL
  async detectFormsFromInput(input: { html?: string; url?: string }): Promise<DetectedForm[]> {
    if (input.html) {
      return this.parseHtmlToForms(input.html);
    }
    if (input.url) {
      const res = await fetch(input.url, { redirect: "follow" });
      const html = await res.text();
      return this.parseHtmlToForms(html);
    }
    return [];
  }

  async saveForms(userId: string, websiteId: string, forms: DetectedForm[]): Promise<{ message: string }> {
    // ensure website belongs to user
    const website = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.id = :websiteId", { websiteId })
      .andWhere("website.createdBy = :userId", { userId })
      .getOne();
    if (!website) {
      // no-op for security; alternatively throw NotFound
      return { message: SUCCESS_MESSAGES.UPDATED };
    }

    // replace all existing forms for this website with new set
    const existing = await this.formsRepository
      .createQueryBuilder("wf")
      .where("wf.websiteId = :websiteId", { websiteId })
      .getMany();
    if (existing.length) await this.formsRepository.remove(existing);

    const rows = forms.map((f) =>
      this.formsRepository.create({
        websiteId,
        name: f.name,
        action: f.action,
        method: f.method,
        selector: f.selector,
        fields: f.fields,
        createdBy: userId,
      }),
    );
    if (rows.length) await this.formsRepository.save(rows);
    return { message: SUCCESS_MESSAGES.UPDATED };
  }

  async listForms(userId: string, websiteId: string) {
    // ensure ownership
    const website = await this.websitesRepository
      .createQueryBuilder("website")
      .where("website.id = :websiteId", { websiteId })
      .andWhere("website.createdBy = :userId", { userId })
      .getOne();
    if (!website) return [];

    const leadsSubQuery = this.leadsRepository
      .createQueryBuilder("lead")
      .select("COUNT(lead.id)", "leadsCount")
      .where("lead.formId = wf.id")
      .getQuery();

    // Get all forms for the website
    const forms = await this.formsRepository
      .createQueryBuilder("wf")
      .where("wf.websiteId = :websiteId", { websiteId })
      .addSelect(`(${leadsSubQuery})`, "leadCount")
      .orderBy("wf.createdAt", "DESC")
      .getRawMany();

    if (forms.length === 0) return [];

    return forms.map((form) => ({
      id: form.wf_id,
      websiteId: form.wf_websiteId,
      name: form.wf_name,
      action: form.wf_action,
      method: form.wf_method,
      selector: form.wf_selector,
      fields: form.wf_fields,
      createdAt: form.wf_createdAt,
      updatedAt: form.wf_updatedAt,
      leadCount: form.leadCount || 0,
    }));
  }
}
