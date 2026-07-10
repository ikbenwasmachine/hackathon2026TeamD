import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { CurrentUserContext } from "./currentUserContextValue";
import { getCurrentStudentId, setCurrentStudentId as persistCurrentStudentId } from "./currentUser";

export function CurrentUserProvider({ children }: { children: ReactNode }): ReactElement {
	const [studentId, setStudentIdState] = useState<string | null>(() => getCurrentStudentId());

	function setStudentId(id: string): void {
		persistCurrentStudentId(id);
		setStudentIdState(id);
	}

	return <CurrentUserContext.Provider value={{ studentId, setStudentId }}>{children}</CurrentUserContext.Provider>;
}
