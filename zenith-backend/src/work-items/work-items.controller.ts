import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { WorkItemsService } from './work-items.service';
import { CreateWorkItemDto } from './dto/create-work-item.dto';
import { UpdateWorkItemDto } from './dto/update-work-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class WorkItemsController {
  constructor(private readonly workItemsService: WorkItemsService) {}

  @Post('projects/:projectId/work-items')
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createWorkItemDto: CreateWorkItemDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.workItemsService.create(projectId, createWorkItemDto, userId);
  }

  @Get('projects/:projectId/work-items')
  findAll(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.workItemsService.findAllInProject(projectId, userId);
  }

  @Get('work-items/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.workItemsService.findOne(id, userId);
  }

  @Patch('work-items/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkItemDto: UpdateWorkItemDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.workItemsService.update(id, updateWorkItemDto, userId);
  }

  @Delete('work-items/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.workItemsService.remove(id, userId);
  }
}
