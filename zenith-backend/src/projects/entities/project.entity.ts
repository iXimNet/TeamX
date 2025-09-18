import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 10, unique: true })
  projectKey: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, user => user.ownedProjects)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
