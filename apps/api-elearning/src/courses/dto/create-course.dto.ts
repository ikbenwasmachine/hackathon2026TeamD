import { IsArray, IsBoolean, IsIn, IsString } from 'class-validator';
import type { CourseLevel, CreateCourseRequestDto } from 'shared-types';

const COURSE_LEVELS: CourseLevel[] = ['JUNIOR', 'MEDIOR', 'SENIOR'];

export class CreateCourseDto implements CreateCourseRequestDto {
  @IsString()
  adminId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsIn(COURSE_LEVELS)
  level!: CourseLevel;

  @IsArray()
  @IsString({ each: true })
  assignments!: string[];

  @IsBoolean()
  published!: boolean;
}
