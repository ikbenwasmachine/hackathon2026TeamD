import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "database";
import type { CourseDetailDto, CourseSummaryDto, LessonDto } from "shared-types";

@Injectable()
export class CoursesService {
    async findPublished(): Promise<CourseSummaryDto[]> {
        const courses = await prisma.course.findMany({
            where: { published: true },
            include: { instructor: true },
            orderBy: { createdAt: "asc" },
        });

        return courses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            instructorName: course.instructor.name,
        }));
    }

    async findById(id: string): Promise<CourseDetailDto> {
        const course = await prisma.course.findUnique({
            where: { id },
            include: { instructor: true, lessons: { orderBy: { order: "asc" } } },
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
        }));

        return {
            id: course.id,
            title: course.title,
            description: course.description,
            instructorName: course.instructor.name,
            lessons,
        };
    }
}
