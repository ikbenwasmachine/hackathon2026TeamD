import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../auth/useCurrentUser";
import { useTheme } from "../theme/useTheme";

export function Nav(): ReactElement {
	const { account, accounts, setAccountId } = useCurrentUser();
	const { theme, toggleTheme } = useTheme();

	return (
		<nav>
			<Link to="/">Home</Link> | <Link to="/courses">Courses</Link> | <Link to="/signup">Create Account</Link>
			{account?.role === "ADMIN" ? (
				<>
					{" "}
					| <Link to="/admin">Admin</Link>
				</>
			) : null}
			<select value={account?.id ?? ""} onChange={(event) => setAccountId(event.target.value)}>
				<option value="" disabled>
					Sign in as...
				</option>
				{accounts.map((candidate) => (
					<option key={candidate.id} value={candidate.id}>
						{candidate.name} ({candidate.role})
					</option>
				))}
			</select>
			<button type="button" className="button-secondary" onClick={toggleTheme}>
				{theme === "light" ? "Dark mode" : "Light mode"}
			</button>
		</nav>
	);
}
