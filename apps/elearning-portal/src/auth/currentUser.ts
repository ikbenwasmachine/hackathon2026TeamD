const STORAGE_KEY = "elearning:currentAccountId";

export function getCurrentAccountId(): string | null {
    return window.localStorage.getItem(STORAGE_KEY);
}

export function setCurrentAccountId(accountId: string): void {
    window.localStorage.setItem(STORAGE_KEY, accountId);
}

export function clearCurrentAccountId(): void {
    window.localStorage.removeItem(STORAGE_KEY);
}
