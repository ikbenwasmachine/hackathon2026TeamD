import { createContext } from "react";

export interface CurrentUserContextValue {
    studentId: string | null;
    setStudentId: (id: string) => void;
}

export const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined);
