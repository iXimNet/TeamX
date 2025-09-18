import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { WorkItemsService } from '../work-items/work-items.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private workItemsService: WorkItemsService,
    private notificationsGateway: NotificationsGateway,
    private usersService: UsersService,
  ) {}

  async create(workItemId: number, createDto: CreateCommentDto, userId: number): Promise<Comment> {
    // Authorization check: can the user access this work item?
    const workItem = await this.workItemsService.findOne(workItemId, userId);

    const comment = this.commentsRepository.create({
      ...createDto,
      workItemId,
      userId,
    });

    const savedComment = await this.commentsRepository.save(comment);

    // Handle mentions
    const mentionRegex = /@([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    let match;
    const mentionedEmails = new Set<string>();
    while ((match = mentionRegex.exec(createDto.content)) !== null) {
      mentionedEmails.add(match[1]);
    }

    for (const email of mentionedEmails) {
      const mentionedUser = await this.usersService.findOneByEmail(email);
      if (mentionedUser && mentionedUser.id !== userId) { // Don't notify user for self-mention
        this.notificationsGateway.sendNotificationToUser(mentionedUser.id, {
          message: `You were mentioned by ${workItem.reporter.fullName} in a comment on ticket ZEN-${workItem.itemKey}`,
          link: `/projects/${workItem.projectId}/board?selectedItem=${workItem.id}`, // Example link
        });
      }
    }

    return savedComment;
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
