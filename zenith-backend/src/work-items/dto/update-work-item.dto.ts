import { IsString, IsEnum, IsInt, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';

export class UpdateWorkItemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['STORY', 'TASK', 'BUG'])
  @IsOptional()
  type?: 'STORY' | 'TASK' | 'BUG';

  @IsInt()
  @IsOptional()
  statusId?: number;

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
