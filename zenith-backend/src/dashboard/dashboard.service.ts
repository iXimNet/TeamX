import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkItem } from '../work-items/entities/work-item.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(WorkItem)
    private workItemRepository: Repository<WorkItem>,
    private projectsService: ProjectsService,
  ) {}

  async getStatusDistribution(projectId: number, userId: number) {
    await this.projectsService.findOne(projectId, userId); // Auth check

    const distribution = await this.workItemRepository
      .createQueryBuilder('workItem')
      .select('status.name', 'statusName')
      .addSelect('COUNT(workItem.id)', 'count')
      .innerJoin('workItem.status', 'status')
      .where('workItem.projectId = :projectId', { projectId })
      .groupBy('status.id')
      .orderBy('status.displayOrder', 'ASC')
      .getRawMany();

    return distribution.map(item => ({
        statusName: item.statusName,
        count: parseInt(item.count, 10),
    }));
  }

  async getBurndownData(projectId: number, userId: number) {
    await this.projectsService.findOne(projectId, userId); // Auth check

    const allItems = await this.workItemRepository.find({
      where: { projectId },
      relations: ['status'],
    });

    const totalEffort = allItems.reduce((sum, item) => sum + (item.estimatedEffort || 0), 0);

    const completedEffort = allItems
      .filter(item => item.status.name.toLowerCase() === 'done')
      .reduce((sum, item) => sum + (item.estimatedEffort || 0), 0);

    return {
      totalEffort,
      completedEffort,
      remainingEffort: totalEffort - completedEffort,
    };
  }
}
