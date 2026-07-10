import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { EnrollmentDto, QuizSubmissionResultDto } from 'shared-types';
import { EnrollmentsService } from './enrollments.service';
import { EnrollDto } from './dto/enroll.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { ToggleLessonDto } from './dto/toggle-lesson.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  enroll(@Body() dto: EnrollDto): Promise<EnrollmentDto> {
    return this.enrollmentsService.enroll(dto.studentId, dto.courseId);
  }

  @Get()
  findForStudent(
    @Query('studentId') studentId: string,
  ): Promise<EnrollmentDto[]> {
    return this.enrollmentsService.listForStudent(studentId);
  }

  @Patch(':id/lessons/:lessonId')
  toggleLesson(
    @Param('id') id: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: ToggleLessonDto,
  ): Promise<EnrollmentDto> {
    return this.enrollmentsService.toggleLesson(id, lessonId, dto.completed);
  }

  @Post(':id/lessons/:lessonId/quiz')
  submitQuiz(
    @Param('id') id: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: SubmitQuizDto,
  ): Promise<QuizSubmissionResultDto> {
    return this.enrollmentsService.submitQuiz(id, lessonId, dto.answers);
  }
}
