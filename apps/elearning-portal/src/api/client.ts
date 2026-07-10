import type { AccountDto, CourseDetailDto, CourseSummaryDto, CreateAccountRequestDto, EnrollmentDto } from "shared-types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, init);
    if (!response.ok) {
        throw new Error(`Request to ${path} failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
}

function postJson<T>(path: string, body: unknown): Promise<T> {
    return fetchJson<T>(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

function patchJson<T>(path: string, body: unknown): Promise<T> {
    return fetchJson<T>(path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

export function fetchCourses(): Promise<CourseSummaryDto[]> {
    return fetchJson<CourseSummaryDto[]>("/courses");
}

export function fetchCourse(id: string): Promise<CourseDetailDto> {
    return fetchJson<CourseDetailDto>(`/courses/${id}`);
}

export function createAccount(request: CreateAccountRequestDto): Promise<AccountDto> {
    return postJson<AccountDto>("/accounts", request);
}

export function fetchStudents(): Promise<AccountDto[]> {
    return fetchJson<AccountDto[]>("/accounts?role=STUDENT");
}

export function fetchEnrollments(studentId: string): Promise<EnrollmentDto[]> {
    return fetchJson<EnrollmentDto[]>(`/enrollments?studentId=${encodeURIComponent(studentId)}`);
}

export function enrollInCourse(studentId: string, courseId: string): Promise<EnrollmentDto> {
    return postJson<EnrollmentDto>("/enrollments", { studentId, courseId });
}

export function toggleLessonCompletion(enrollmentId: string, lessonId: string, completed: boolean): Promise<EnrollmentDto> {
    return patchJson<EnrollmentDto>(`/enrollments/${enrollmentId}/lessons/${lessonId}`, { completed });
}
