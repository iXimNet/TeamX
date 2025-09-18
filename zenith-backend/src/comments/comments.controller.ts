import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('work-items/:workItemId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('workItemId', ParseIntPipe) workItemId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.commentsService.create(workItemId, createCommentDto, userId);
  }

  @Get()
  findAll(
    @Param('workItemId', ParseIntPipe) workItemId: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.commentsService.findAllForWorkItem(workItemId, userId);
  }
}
