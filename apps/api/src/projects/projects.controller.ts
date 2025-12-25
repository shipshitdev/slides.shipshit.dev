import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private getUserId(authHeader: string): string {
    // In production, this would verify the Clerk JWT and extract the userId
    // For now, we'll extract it from a custom header set by the frontend
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }
    // The frontend will pass the Clerk userId in the header
    return authHeader.replace('Bearer ', '');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(
    @Headers('x-user-id') userId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
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
    @Body() updateProjectDto: UpdateProjectDto,
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
