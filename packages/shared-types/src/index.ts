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
    instructorName: string;
}

export interface CourseDetailDto extends CourseSummaryDto {
    lessons: LessonDto[];
}
