import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class DetectedFieldDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  required?: boolean;
}

export class DetectedFormDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  selector?: string;

  @ApiProperty({ type: [DetectedFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetectedFieldDto)
  fields: DetectedFieldDto[];
}

export class SaveWebsiteFormsDto {
  @ApiProperty({ type: [DetectedFormDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetectedFormDto)
  forms: DetectedFormDto[];
}

export class DetectFormsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  html?: string;
}
