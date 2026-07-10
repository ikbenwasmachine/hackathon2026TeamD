import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from 'database';
import type {
  AdminCourseDto,
  CourseDetailDto,
  CourseSummaryDto,
  LessonDto,
} from 'shared-types';
import type { CreateCourseDto } from './dto/create-course.dto';
import type { UpdateCourseDto } from './dto/update-course.dto';
import { parsePptx } from './pptx-parser';

@Injectable()
export class CoursesService {
  async findPublished(): Promise<CourseSummaryDto[]> {
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: { instructor: true },
      orderBy: { createdAt: 'asc' },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      instructorName: course.instructor.name,
    }));
  }

  async findById(id: string): Promise<CourseDetailDto> {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        lessons: {
          orderBy: { order: 'asc' },
          include: { questions: { orderBy: { order: 'asc' } } },
        },
      },
    });

    if (!course || !course.published) {
      throw new NotFoundException(`Course ${id} not found`);
    }

    const lessons: LessonDto[] = course.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      order: lesson.order,
      questions: lesson.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
      })),
    }));

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      assignments: course.assignments,
      instructorName: course.instructor.name,
      lessons,
    };
  }

  async findAllForAdmin(adminId: string): Promise<AdminCourseDto[]> {
    await this.assertAdmin(adminId);

    const courses = await prisma.course.findMany({
      include: { instructor: true },
      orderBy: { createdAt: 'asc' },
    });

    return courses.map((course) => this.toAdminDto(course));
  }

  async create(dto: CreateCourseDto): Promise<AdminCourseDto> {
    await this.assertAdmin(dto.adminId);

    const course = await prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        level: dto.level,
        assignments: dto.assignments,
        published: dto.published,
        instructorId: dto.adminId,
      },
      include: { instructor: true },
    });

    return this.toAdminDto(course);
  }

  async createFromPptx(
    adminId: string,
    filename: string,
    buffer: Buffer,
  ): Promise<AdminCourseDto> {
    await this.assertAdmin(adminId);

    const slides = await parsePptx(buffer);
    if (slides.length === 0) {
      throw new BadRequestException(
        'No slides were found in this PowerPoint file',
      );
    }

    const title = filename
      .replace(/\.pptx$/i, '')
      .replace(/[_-]+/g, ' ')
      .trim();

    const course = await prisma.course.create({
      data: {
        title: title || 'Imported course',
        description: `Imported from ${filename}. Edit this description in the admin screen.`,
        level: 'JUNIOR',
        assignments: [],
        published: false,
        instructorId: adminId,
        lessons: {
          create: slides.map((slide, index) => ({
            title: slide.title || `Slide ${index + 1}`,
            content: slide.content,
            order: index + 1,
          })),
        },
      },
      include: { instructor: true },
    });

    return this.toAdminDto(course);
  }

  async update(id: string, dto: UpdateCourseDto): Promise<AdminCourseDto> {
    await this.assertAdmin(dto.adminId);

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Course ${id} not found`);
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        level: dto.level,
        assignments: dto.assignments,
        published: dto.published,
      },
      include: { instructor: true },
    });

    return this.toAdminDto(course);
  }

  async delete(id: string, adminId: string): Promise<void> {
    await this.assertAdmin(adminId);

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Course ${id} not found`);
    }

    await prisma.course.delete({ where: { id } });
  }

  private async assertAdmin(adminId: string): Promise<void> {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
  }

  private toAdminDto(course: {
    id: string;
    title: string;
    description: string;
    level: AdminCourseDto['level'];
    assignments: string[];
    published: boolean;
    instructor: { name: string };
  }): AdminCourseDto {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      assignments: course.assignments,
      published: course.published,
      instructorName: course.instructor.name,
    };
  }
}
