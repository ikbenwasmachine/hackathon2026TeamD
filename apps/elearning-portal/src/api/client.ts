import type { CourseDetailDto, CourseSummaryDto } from "shared-types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`Request to ${path} failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export function fetchCourses(): Promise<CourseSummaryDto[]> {
    return fetchJson<CourseSummaryDto[]>("/courses");
}

export function fetchCourse(id: string): Promise<CourseDetailDto> {
    return fetchJson<CourseDetailDto>(`/courses/${id}`);
}
