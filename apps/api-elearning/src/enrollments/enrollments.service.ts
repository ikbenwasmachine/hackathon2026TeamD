import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, prisma } from 'database';
import type { EnrollmentDto } from 'shared-types';

const enrollmentWithCourse = Prisma.validator<Prisma.EnrollmentDefaultArgs>()({
  include: { course: { include: { instructor: true, lessons: true } } },
});

type EnrollmentWithCourse = Prisma.EnrollmentGetPayload<
  typeof enrollmentWithCourse
>;

@Injectable()
export class EnrollmentsService {
  async enroll(studentId: string, courseId: string): Promise<EnrollmentDto> {
    const enrollment = await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId, courseId } },
      update: {},
      create: { studentId, courseId },
      ...enrollmentWithCourse,
    });
    return this.toDto(enrollment);
  }

  async listForStudent(studentId: string): Promise<EnrollmentDto[]> {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'asc' },
      ...enrollmentWithCourse,
    });
    return enrollments.map((enrollment) => this.toDto(enrollment));
  }

  async toggleLesson(
    enrollmentId: string,
    lessonId: string,
    completed: boolean,
  ): Promise<EnrollmentDto> {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      ...enrollmentWithCourse,
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${enrollmentId} not found`);
    }

    const nextCompleted = completed
      ? Array.from(new Set([...enrollment.completedLessonIds, lessonId]))
      : enrollment.completedLessonIds.filter((id) => id !== lessonId);

    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { completedLessonIds: nextCompleted },
      ...enrollmentWithCourse,
    });

    return this.toDto(updated);
  }

  private toDto(enrollment: EnrollmentWithCourse): EnrollmentDto {
    return {
      id: enrollment.id,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        level: enrollment.course.level,
        instructorName: enrollment.course.instructor.name,
      },
      completedLessonIds: enrollment.completedLessonIds,
      totalLessons: enrollment.course.lessons.length,
    };
  }
}
