import { createContext } from "react";
import type { AccountDto } from "shared-types";

export interface CurrentUserContextValue {
    account: AccountDto | null;
    accounts: AccountDto[];
    setAccountId: (id: string) => void;
    refreshAccounts: () => void;
    logout: () => void;
}

export const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined);
