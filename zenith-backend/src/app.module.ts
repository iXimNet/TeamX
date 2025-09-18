import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { User } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { UsersModule } from './users/users.module';
import { ProjectStatus } from './projects/entities/project-status.entity';
import { Label } from './projects/entities/label.entity';
import { WorkItem } from './work-items/entities/work-item.entity';
import { WorkItemsModule } from './work-items/work-items.module';
import { Comment } from './comments/entities/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // Replace with your DB host
      port: 3306,
      username: 'root', // Replace with your DB username
      password: 'password', // Replace with your DB password
      database: 'zenith', // Replace with your DB name
      entities: [User, Project, ProjectStatus, Label, WorkItem, Comment], // Add other entities here as they are created
      synchronize: true, // DEV only: auto-creates schema. Disable in production.
    }),
    AuthModule,
    ProjectsModule,
    UsersModule,
    WorkItemsModule,
    CommentsModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
