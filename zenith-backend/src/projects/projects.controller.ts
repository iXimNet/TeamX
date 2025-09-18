import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    // req.user is populated by the JwtStrategy
    const ownerId = req.user.userId;
    return this.projectsService.create(createProjectDto, ownerId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.projectsService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.projectsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    const userId = req.user.userId;
    return this.projectsService.update(id, updateProjectDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.projectsService.remove(id, userId);
  }

  @Get(':id/statuses')
  findAllStatuses(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.projectsService.findAllStatusesForProject(id, userId);
  }
}
