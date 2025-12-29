import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { DecksService } from './decks.service';
import type { CreateDeckDto } from './dto/create-deck.dto';
import type { UpdateDeckDto } from './dto/update-deck.dto';

@ApiTags('decks')
@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new deck' })
  create(@Headers('x-user-id') userId: string, @Body() createDeckDto: CreateDeckDto) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.decksService.create(userId, createDeckDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all decks for a project' })
  @ApiQuery({ name: 'projectId', required: true })
  findAll(@Headers('x-user-id') userId: string, @Query('projectId') projectId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.decksService.findAllByProject(userId, projectId);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get a public deck by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.decksService.findBySlug(slug);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a deck by ID' })
  findOne(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.decksService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a deck' })
  update(
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.decksService.update(userId, id, updateDeckDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a deck' })
  remove(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.decksService.remove(userId, id);
  }
}
