export type CourseLevel = "JUNIOR" | "MEDIOR" | "SENIOR";

export type Role = "STUDENT" | "ADMIN";

export interface QuizQuestionDto {
    id: string;
    question: string;
    options: string[];
}

export interface LessonDto {
    id: string;
    title: string;
    content: string;
    videoUrl: string | null;
    order: number;
    questions: QuizQuestionDto[];
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

export interface QuizSubmissionRequestDto {
    answers: number[];
}

export interface QuizSubmissionResultDto {
    correctness: boolean[];
    allCorrect: boolean;
    enrollment: EnrollmentDto;
}

export interface AdminCourseDto {
    id: string;
    title: string;
    description: string;
    level: CourseLevel;
    assignments: string[];
    published: boolean;
    instructorName: string;
}

export interface CreateCourseRequestDto {
    adminId: string;
    title: string;
    description: string;
    level: CourseLevel;
    assignments: string[];
    published: boolean;
}

export interface UpdateCourseRequestDto {
    adminId: string;
    title?: string;
    description?: string;
    level?: CourseLevel;
    assignments?: string[];
    published?: boolean;
}

export interface CreateAccountRequestDto {
    name: string;
    email: string;
    role: Role;
    dateOfBirth: string;
    team: string;
    password: string;
}

export interface AccountDto {
    id: string;
    name: string;
    email: string;
    role: Role;
    dateOfBirth: string | null;
    team: string | null;
}

export interface EnrollmentDto {
    id: string;
    course: CourseSummaryDto;
    completedLessonIds: string[];
    totalLessons: number;
}

export interface BadgeDto {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
}
