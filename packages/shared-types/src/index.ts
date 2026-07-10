export type CourseLevel = "JUNIOR" | "MEDIOR" | "SENIOR";

export interface LessonDto {
    id: string;
    title: string;
    content: string;
    videoUrl: string | null;
    order: number;
}

export interface CourseSummaryDto {
    id: string;
    title: string;
    description: string;
    level: CourseLevel;
    instructorName: string;
}

export interface CourseDetailDto extends CourseSummaryDto {
    assignments: string[];
    lessons: LessonDto[];
}
