import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './entities/project-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectStatus])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService], // Export ProjectsService
})
export class ProjectsModule {}
