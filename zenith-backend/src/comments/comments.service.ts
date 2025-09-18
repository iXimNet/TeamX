import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { WorkItemsService } from '../work-items/work-items.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private workItemsService: WorkItemsService,
  ) {}

  async create(workItemId: number, createDto: CreateCommentDto, userId: number): Promise<Comment> {
    // Authorization check: can the user access this work item?
    await this.workItemsService.findOne(workItemId, userId);

    const comment = this.commentsRepository.create({
      ...createDto,
      workItemId,
      userId,
    });

    return this.commentsRepository.save(comment);
  }

  async findAllForWorkItem(workItemId: number, userId: number): Promise<Comment[]> {
    // Authorization check
    await this.workItemsService.findOne(workItemId, userId);

    return this.commentsRepository.find({
      where: { workItemId },
      relations: ['user'], // Eager load the user details
      order: { createdAt: 'ASC' },
    });
  }
}
