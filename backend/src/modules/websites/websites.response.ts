import { ApiPropertyWritable } from "src/modules/swagger/swagger.writable.decorator";

import { Expose } from "class-transformer";

export class WebsiteResponse {
  @Expose()
  @ApiPropertyWritable()
  id: string;

  @Expose()
  @ApiPropertyWritable()
  name: string;

  @Expose()
  @ApiPropertyWritable()
  url: string;

  @Expose()
  @ApiPropertyWritable()
  secretKey: string;

  @Expose()
  @ApiPropertyWritable()
  isActive: boolean;

  @Expose()
  @ApiPropertyWritable()
  lastScannedAt: Date;
}

export class WebsitesResponse extends WebsiteResponse {
  @Expose()
  @ApiPropertyWritable()
  totalLeads: number;

  @Expose()
  @ApiPropertyWritable()
  formsDetected: number;
}

export class WebsitesListResponse {
  @Expose()
  @ApiPropertyWritable({ type: [WebsitesResponse] })
  data: WebsitesResponse[];

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
