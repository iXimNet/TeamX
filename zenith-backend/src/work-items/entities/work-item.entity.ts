import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique, OneToMany, ManyToMany, JoinTable
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { ProjectStatus } from '../../projects/entities/project-status.entity';
import { Label } from '../../projects/entities/label.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('work_items')
@Unique(['projectId', 'itemKey'])
export class WorkItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemKey: number;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['STORY', 'TASK', 'BUG'] })
  type: 'STORY' | 'TASK' | 'BUG';

  @Column()
  statusId: number;

  @ManyToOne(() => ProjectStatus, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'statusId' })
  status: ProjectStatus;

  @Column({ type: 'enum', enum: ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' })
  priority: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW';

  @Column({ nullable: true })
  assigneeId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee: User;

  @Column()
  reporterId: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => WorkItem, (item) => item.children, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: WorkItem;

  // parentId is already defined by the ManyToOne relationship, but this makes it explicit for DTOs
  // This column is automatically created by TypeORM, no need for @Column decorator
  // We just need it for type safety
  // parentId: number | null;

  @OneToMany(() => WorkItem, (item) => item.parent)
  children: WorkItem[];

  @ManyToMany(() => Label, { cascade: true, eager: true })
  @JoinTable({
      name: 'work_item_labels',
      joinColumn: { name: 'work_item_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'label_id', referencedColumnName: 'id' },
  })
  labels: Label[];

  @OneToMany(() => Comment, (comment) => comment.workItem)
  comments: Comment[];

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  estimatedEffort: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
