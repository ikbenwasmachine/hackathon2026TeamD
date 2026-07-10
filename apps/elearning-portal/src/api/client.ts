import type {
    AccountDto,
    AdminCourseDto,
    CourseDetailDto,
    CourseSummaryDto,
    CreateAccountRequestDto,
    CreateCourseRequestDto,
    EnrollmentDto,
    QuizSubmissionResultDto,
    UpdateCourseRequestDto,
} from "shared-types";

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

async function deleteRequest(path: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
    if (!response.ok) {
        throw new Error(`Request to ${path} failed with status ${response.status}`);
    }
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

export function fetchAccounts(): Promise<AccountDto[]> {
    return fetchJson<AccountDto[]>("/accounts");
}

export function fetchAdminCourses(adminId: string): Promise<AdminCourseDto[]> {
    return fetchJson<AdminCourseDto[]>(`/courses/admin?adminId=${encodeURIComponent(adminId)}`);
}

export function createCourse(request: CreateCourseRequestDto): Promise<AdminCourseDto> {
    return postJson<AdminCourseDto>("/courses", request);
}

export function updateCourse(id: string, request: UpdateCourseRequestDto): Promise<AdminCourseDto> {
    return patchJson<AdminCourseDto>(`/courses/${id}`, request);
}

export function deleteCourse(id: string, adminId: string): Promise<void> {
    return deleteRequest(`/courses/${id}?adminId=${encodeURIComponent(adminId)}`);
}

export async function uploadCoursePptx(adminId: string, file: File): Promise<AdminCourseDto> {
    const formData = new FormData();
    formData.append("adminId", adminId);
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/courses/upload-pptx`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Request to /courses/upload-pptx failed with status ${response.status}`);
    }

    return response.json() as Promise<AdminCourseDto>;
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

export function submitLessonQuiz(enrollmentId: string, lessonId: string, answers: number[]): Promise<QuizSubmissionResultDto> {
    return postJson<QuizSubmissionResultDto>(`/enrollments/${enrollmentId}/lessons/${lessonId}/quiz`, { answers });
}
