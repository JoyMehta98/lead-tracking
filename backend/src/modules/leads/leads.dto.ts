import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsInt, Min, IsIn, IsObject } from "class-validator";
import { TrimString } from "src/decorators/trim-string.decorator";
import { Type } from "class-transformer";

export class CreateLeadDto {
  @ApiProperty()
  @IsNotEmpty()
  @TrimString()
  @IsString()
  websiteId: string;

  @ApiPropertyOptional({ description: "Website secret key (optional for authenticated dashboard creates)" })
  @IsOptional()
  @TrimString()
  @IsString()
  secretKey?: string;

  @ApiProperty({ description: "Name of the website form that captured the lead" })
  @IsNotEmpty()
  @TrimString()
  @IsString()
  formName: string;

  @ApiProperty({ description: "All submitted form fields", type: Object })
  @IsNotEmpty()
  @IsObject()
  fields: Record<string, unknown>;

  @ApiPropertyOptional({ description: "Optional metadata (url, userAgent, etc.)", type: Object })
  @IsOptional()
  @IsObject()
  meta?: Record<string, unknown>;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}

export class LeadsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ default: "createdAt" })
  @IsOptional()
  @TrimString()
  @IsString()
  sort?: string = "createdAt";

  @ApiPropertyOptional({ enum: ["ASC", "DESC"], default: "DESC" })
  @IsOptional()
  @TrimString()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "DESC";

  @ApiPropertyOptional({ description: "Search by field value" })
  @IsOptional()
  @TrimString()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Search by field name" })
  @IsOptional()
  @TrimString()
  @IsString()
  field?: string;

  @ApiPropertyOptional({ description: "Filter by websiteId" })
  @IsOptional()
  @TrimString()
  @IsString()
  websiteId?: string;

  @ApiPropertyOptional({ description: "Filter by formId" })
  @IsOptional()
  @TrimString()
  @IsString()
  formId?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Type(() => Boolean)
  isPagination?: boolean = true;
}

export class DeleteManyLeadsDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  ids: string[];
}
