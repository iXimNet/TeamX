import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  projectKey: string;

  @IsString()
  @IsOptional()
  description?: string;
}
