import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WorkItem } from './entities/work-item.entity';
import { CreateWorkItemDto } from './dto/create-work-item.dto';
import { UpdateWorkItemDto } from './dto/update-work-item.dto';
import { ProjectsService } from '../projects/projects.service';
import { Label } from '../projects/entities/label.entity';

@Injectable()
export class WorkItemsService {
  constructor(
    @InjectRepository(WorkItem)
    private workItemsRepository: Repository<WorkItem>,
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
    private projectsService: ProjectsService,
    private dataSource: DataSource,
  ) {}

  async create(projectId: number, createDto: CreateWorkItemDto, userId: number): Promise<WorkItem> {
    await this.projectsService.findOne(projectId, userId); // Authorization check

    const workItem = new WorkItem();
    Object.assign(workItem, createDto);
    workItem.projectId = projectId;
    workItem.reporterId = userId;

    if (createDto.labelIds && createDto.labelIds.length > 0) {
      const labels = await this.labelsRepository.createQueryBuilder("label")
        .where("label.id IN (:...ids)", { ids: createDto.labelIds })
        .getMany();
      workItem.labels = labels;
    }

    // Transaction to safely get the next itemKey
    return this.dataSource.transaction(async transactionalEntityManager => {
      const latestItem = await transactionalEntityManager.findOne(WorkItem, {
        where: { projectId },
        order: { itemKey: 'DESC' },
      });
      workItem.itemKey = (latestItem?.itemKey || 0) + 1;
      return transactionalEntityManager.save(workItem);
    });
  }

  async findAllInProject(projectId: number, userId: number): Promise<WorkItem[]> {
    await this.projectsService.findOne(projectId, userId); // Authorization check
    return this.workItemsRepository.find({
      where: { projectId },
      relations: ['assignee', 'reporter', 'status', 'labels', 'parent'],
      order: { itemKey: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<WorkItem> {
    const workItem = await this.workItemsRepository.findOne({
      where: { id },
      relations: ['project', 'assignee', 'reporter', 'status', 'labels', 'parent', 'children'],
    });
    if (!workItem) {
      throw new NotFoundException(`Work item with ID ${id} not found`);
    }
    await this.projectsService.findOne(workItem.projectId, userId); // Authorization check
    return workItem;
  }

  async update(id: number, updateDto: UpdateWorkItemDto, userId: number): Promise<WorkItem> {
    const workItem = await this.findOne(id, userId); // This also performs auth check

    if (updateDto.labelIds) {
      const labels = await this.labelsRepository.createQueryBuilder("label")
        .where("label.id IN (:...ids)", { ids: updateDto.labelIds })
        .getMany();
      workItem.labels = labels;
      // remove labelIds from dto to avoid conflict with Object.assign
      delete updateDto.labelIds;
    }

    Object.assign(workItem, updateDto);
    return this.workItemsRepository.save(workItem);
  }

  async remove(id: number, userId: number): Promise<void> {
    const workItem = await this.findOne(id, userId); // Auth check
    await this.workItemsRepository.remove(workItem);
  }
}
