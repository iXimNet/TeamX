import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Project } from './project.entity';

@Entity('labels')
@Unique(['projectId', 'name'])
export class Label {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    projectId: number;

    @Column()
    name: string;

    @Column({ length: 7 })
    color: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;
}
