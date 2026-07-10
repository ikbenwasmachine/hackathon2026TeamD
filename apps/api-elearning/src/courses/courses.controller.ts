import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  AdminCourseDto,
  CourseDetailDto,
  CourseSummaryDto,
} from 'shared-types';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('admin')
  findAllForAdmin(
    @Query('adminId') adminId: string,
  ): Promise<AdminCourseDto[]> {
    return this.coursesService.findAllForAdmin(adminId);
  }

  @Get()
  findAll(): Promise<CourseSummaryDto[]> {
    return this.coursesService.findPublished();
  }

  @Post()
  create(@Body() dto: CreateCourseDto): Promise<AdminCourseDto> {
    return this.coursesService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseDetailDto> {
    return this.coursesService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ): Promise<AdminCourseDto> {
    return this.coursesService.update(id, dto);
  }
}
