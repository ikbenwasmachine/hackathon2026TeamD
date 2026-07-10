import { useEffect, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { ThemeContext } from "./themeContextValue";
import type { Theme } from "./themeContextValue";

const STORAGE_KEY = "elearning:theme";

function getInitialTheme(): Theme {
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark") {
		return stored;
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }): ReactElement {
	const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		window.localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	function toggleTheme(): void {
		setTheme((current) => (current === "light" ? "dark" : "light"));
	}

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
