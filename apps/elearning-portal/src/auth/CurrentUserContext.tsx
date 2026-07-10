import { useEffect, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import type { AccountDto } from "shared-types";
import { fetchAccounts } from "../api/client";
import { CurrentUserContext } from "./currentUserContextValue";
import { getCurrentAccountId, setCurrentAccountId as persistCurrentAccountId } from "./currentUser";

export function CurrentUserProvider({ children }: { children: ReactNode }): ReactElement {
	const [accountId, setAccountIdState] = useState<string | null>(() => getCurrentAccountId());
	const [accounts, setAccounts] = useState<AccountDto[]>([]);

	function loadAccounts(): void {
		fetchAccounts()
			.then(setAccounts)
			.catch(() => {
				setAccounts([]);
			});
	}

	useEffect(() => {
		loadAccounts();
	}, []);

	function setAccountId(id: string): void {
		persistCurrentAccountId(id);
		setAccountIdState(id);
	}

	const account = accounts.find((candidate) => candidate.id === accountId) ?? null;

	return (
		<CurrentUserContext.Provider value={{ account, accounts, setAccountId, refreshAccounts: loadAccounts }}>
			{children}
		</CurrentUserContext.Provider>
	);
}
