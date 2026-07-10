import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, prisma } from 'database';
import type { EnrollmentDto, QuizSubmissionResultDto } from 'shared-types';

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

  async submitQuiz(
    enrollmentId: string,
    lessonId: string,
    answers: number[],
  ): Promise<QuizSubmissionResultDto> {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${enrollmentId} not found`);
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    if (!lesson || lesson.courseId !== enrollment.courseId) {
      throw new NotFoundException(`Lesson ${lessonId} not found`);
    }

    if (answers.length !== lesson.questions.length) {
      throw new BadRequestException(
        `Expected ${lesson.questions.length} answers, received ${answers.length}`,
      );
    }

    const correctness = lesson.questions.map(
      (question, index) => question.correctOptionIndex === answers[index],
    );
    const allCorrect = correctness.every(Boolean);

    const nextCompleted = allCorrect
      ? Array.from(new Set([...enrollment.completedLessonIds, lessonId]))
      : enrollment.completedLessonIds;

    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { completedLessonIds: nextCompleted },
      ...enrollmentWithCourse,
    });

    return {
      correctness,
      allCorrect,
      enrollment: this.toDto(updated),
    };
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
