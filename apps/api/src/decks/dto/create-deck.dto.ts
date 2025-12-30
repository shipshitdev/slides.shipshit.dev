import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

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

  @ApiPropertyOptional({ description: 'Slides content', type: [SlideContentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlideContentDto)
  @IsOptional()
  slides?: SlideContentDto[];

  @ApiPropertyOptional({ description: 'Theme overrides', type: DeckThemeDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DeckThemeDto)
  @IsOptional()
  theme?: DeckThemeDto;

  @ApiPropertyOptional({ description: 'Whether the deck is publicly accessible' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
