import { Module } from '@nestjs/common';
import { WorkItemsService } from './work-items.service';
import { WorkItemsController } from './work-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItem } from './entities/work-item.entity';
import { ProjectsModule } from '../projects/projects.module';
import { Label } from '../projects/entities/label.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkItem, Label]),
    ProjectsModule, // Import to use ProjectsService
  ],
  controllers: [WorkItemsController],
  providers: [WorkItemsService],
  exports: [WorkItemsService], // Export the service
})
export class WorkItemsModule {}
