import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('upload-pptx')
  @UseInterceptors(FileInterceptor('file'))
  uploadPptx(
    @UploadedFile() file: Express.Multer.File,
    @Body('adminId') adminId: string,
  ): Promise<AdminCourseDto> {
    if (!file) {
      throw new BadRequestException('A .pptx file is required');
    }
    return this.coursesService.createFromPptx(
      adminId,
      file.originalname,
      file.buffer,
    );
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

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id') id: string,
    @Query('adminId') adminId: string,
  ): Promise<void> {
    return this.coursesService.delete(id, adminId);
  }
}
