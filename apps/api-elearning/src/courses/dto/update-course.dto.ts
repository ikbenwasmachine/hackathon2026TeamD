import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import type { CourseLevel, UpdateCourseRequestDto } from 'shared-types';

const COURSE_LEVELS: CourseLevel[] = ['JUNIOR', 'MEDIOR', 'SENIOR'];

export class UpdateCourseDto implements UpdateCourseRequestDto {
  @IsString()
  adminId!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(COURSE_LEVELS)
  level?: CourseLevel;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignments?: string[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
