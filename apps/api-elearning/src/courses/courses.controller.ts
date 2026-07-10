import { Controller, Get, Param } from '@nestjs/common';
import type { CourseDetailDto, CourseSummaryDto } from 'shared-types';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Promise<CourseSummaryDto[]> {
    return this.coursesService.findPublished();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseDetailDto> {
    return this.coursesService.findById(id);
  }
}
