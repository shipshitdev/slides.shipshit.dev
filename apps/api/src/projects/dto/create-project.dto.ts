import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, IsUrl, ValidateIf, ValidateNested } from 'class-validator';

export class ProjectColorsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  background?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;
}

export class ProjectFontsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heading?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;
}

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  description?: string;

  @ApiPropertyOptional({ description: 'Website URL to extract branding from' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @ValidateIf((o) => o.websiteUrl !== undefined && o.websiteUrl !== '')
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional({ description: 'Logo URL or base64' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ description: 'Brand colors', type: ProjectColorsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ProjectColorsDto)
  @IsOptional()
  colors?: ProjectColorsDto;

  @ApiPropertyOptional({ description: 'Brand fonts', type: ProjectFontsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ProjectFontsDto)
  @IsOptional()
  fonts?: ProjectFontsDto;
}
