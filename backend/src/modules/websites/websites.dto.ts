import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, IsInt, Min, IsIn } from "class-validator";
import { TrimString } from "src/decorators/trim-string.decorator";
import { Type } from "class-transformer";

export class CreateWebsiteDto {
  @ApiProperty()
  @IsNotEmpty()
  @TrimString()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @TrimString()
  @IsUrl()
  url: string;
}

export class DeleteManyWebsitesDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  ids: string[];
}

export class UpdateWebsiteDto extends PartialType(CreateWebsiteDto) {}

export class WebsitesQueryDto {
  @ApiPropertyOptional({ description: "Website ID" })
  @IsOptional()
  @TrimString()
  @IsString()
  websiteId?: string;

  @ApiPropertyOptional({ description: "Page number", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: "Items per page", default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ description: "Sort field", default: "createdAt" })
  @IsOptional()
  @TrimString()
  @IsString()
  sort?: string = "createdAt";

  @ApiPropertyOptional({ description: "Sort order", enum: ["ASC", "DESC"], default: "DESC" })
  @IsOptional()
  @TrimString()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "DESC";

  @ApiPropertyOptional({ description: "Search by name or url" })
  @IsOptional()
  @TrimString()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Enable pagination", default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPagination?: boolean = true;

  @ApiPropertyOptional({ description: "Filter by active state" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
