import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItem } from '../work-items/entities/work-item.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkItem, Project]),
    ProjectsModule, // For auth checks
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
