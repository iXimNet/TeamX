import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from './entities/project-status.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ProjectStatus)
    private statusesRepository: Repository<ProjectStatus>,
  ) {}

  async create(createProjectDto: CreateProjectDto, ownerId: number): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId,
    });
    return this.projectsRepository.save(project);
  }

  async findAllForUser(userId: number): Promise<Project[]> {
    // This should be expanded to include projects the user is a member of, not just owns
    return this.projectsRepository.find({ where: { ownerId: userId } });
  }

  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    // For now, only owner can access. This will be expanded with roles/permissions.
    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this project');
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number): Promise<Project> {
    const project = await this.findOne(id, userId); // findOne includes ownership check

    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id, userId); // findOne includes ownership check
    await this.projectsRepository.remove(project);
  }

  async findAllStatusesForProject(projectId: number, userId: number): Promise<ProjectStatus[]> {
    await this.findOne(projectId, userId); // Authorization check
    return this.statusesRepository.find({
      where: { projectId },
      order: { displayOrder: 'ASC' },
    });
  }
}
