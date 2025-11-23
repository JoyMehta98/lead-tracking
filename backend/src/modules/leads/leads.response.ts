import { ApiPropertyWritable } from "src/modules/swagger/swagger.writable.decorator";
import { Expose, Type } from "class-transformer";

export class LeadResponse {
  @Expose()
  @ApiPropertyWritable()
  id: string;

  @Expose()
  @ApiPropertyWritable()
  websiteId: string;

  @Expose()
  @ApiPropertyWritable()
  formId: string;

  @Expose()
  @ApiPropertyWritable({ type: Object })
  data: Record<string, unknown>;

  @Expose()
  @ApiPropertyWritable({ type: Object, nullable: true })
  meta?: Record<string, unknown>;
}

export class LeadsListResponse {
  @Expose()
  @ApiPropertyWritable({ type: [LeadResponse] })
  @Type(() => LeadResponse)
  data: LeadResponse[];

  @Expose()
  @ApiPropertyWritable()
  total: number;

  @Expose()
  @ApiPropertyWritable()
  page: number;

  @Expose()
  @ApiPropertyWritable()
  limit: number;

  @Expose()
  @ApiPropertyWritable()
  totalPages: number;
}
