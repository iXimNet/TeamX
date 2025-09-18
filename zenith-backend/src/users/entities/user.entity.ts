import { Project } from '../../projects/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  fullName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'MEMBER'],
    default: 'MEMBER',
  })
  role: 'ADMIN' | 'MEMBER';

  @OneToMany(() => Project, project => project.owner)
  ownedProjects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
