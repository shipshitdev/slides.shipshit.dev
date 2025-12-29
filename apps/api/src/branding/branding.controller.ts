import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import type { BrandingService } from './branding.service';

class ExtractBrandingDto {
  @ApiProperty({ description: 'URL to extract branding from' })
  @IsUrl()
  url: string;
}

@ApiTags('branding')
@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Post('extract')
  @ApiOperation({ summary: 'Extract branding from a website URL' })
  extract(@Body() dto: ExtractBrandingDto) {
    return this.brandingService.extractFromUrl(dto.url);
  }
}
