import { IsNotEmpty, IsString, IsEnum, IsInt, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';

export class CreateWorkItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['STORY', 'TASK', 'BUG'])
  type: 'STORY' | 'TASK' | 'BUG';

  @IsInt()
  statusId: number;

  @IsEnum(['HIGHEST', 'HIGH', 'MEDIUM', 'LOW'])
  @IsOptional()
  priority?: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW';

  @IsInt()
  @IsOptional()
  assigneeId?: number;

  @IsInt()
  @IsOptional()
  parentId?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsNumber()
  @IsOptional()
  estimatedEffort?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  labelIds?: number[];
}
