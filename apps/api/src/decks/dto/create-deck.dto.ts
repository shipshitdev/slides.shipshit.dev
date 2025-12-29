import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class SlideContentDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsObject()
  data: Record<string, unknown>;
}

export class DeckThemeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  colors?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  fonts?: Record<string, string>;
}

export class CreateDeckDto {
  @ApiProperty({ description: 'Project ID this deck belongs to' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Deck title' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Target audience type',
    enum: ['cold_leads', 'customers', 'investors', 'custom'],
  })
  @IsEnum(['cold_leads', 'customers', 'investors', 'custom'])
  audienceType: string;

  @ApiPropertyOptional({ description: 'Slides content' })
  @IsOptional()
  @IsArray()
  slides?: SlideContentDto[];

  @ApiPropertyOptional({ description: 'Theme overrides' })
  @IsOptional()
  @IsObject()
  theme?: DeckThemeDto;

  @ApiPropertyOptional({ description: 'Whether the deck is publicly accessible' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
