import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
import type { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Headers('x-user-id') userId: string, @Body() createProjectDto: CreateProjectDto) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.projectsService.create(userId, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for current user' })
  findAll(@Headers('x-user-id') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  findOne(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.projectsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.projectsService.update(userId, id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    return this.projectsService.remove(userId, id);
  }
}
