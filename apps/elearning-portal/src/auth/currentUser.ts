const STORAGE_KEY = "elearning:currentStudentId";

export function getCurrentStudentId(): string | null {
    return window.localStorage.getItem(STORAGE_KEY);
}

export function setCurrentStudentId(studentId: string): void {
    window.localStorage.setItem(STORAGE_KEY, studentId);
}

export function clearCurrentStudentId(): void {
    window.localStorage.removeItem(STORAGE_KEY);
}
