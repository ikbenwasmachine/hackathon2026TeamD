import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import type { Role } from "shared-types";
import { createAccount } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

export function CreateAccountPage(): ReactElement {
	const navigate = useNavigate();
	const { setAccountId, refreshAccounts } = useCurrentUser();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<Role>("STUDENT");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [team, setTeam] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		setError(null);
		try {
			const account = await createAccount({ name, email, role, dateOfBirth, team, password });
			refreshAccounts();
			setAccountId(account.id);
			void navigate("/");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to create account");
		}
	}

	return (
		<section>
			<h1>Create Account</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Name
					<input value={name} onChange={(event) => setName(event.target.value)} required />
				</label>
				<label>
					Email
					<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
				</label>
				<label>
					Role
					<select value={role} onChange={(event) => setRole(event.target.value === "ADMIN" ? "ADMIN" : "STUDENT")}>
						<option value="STUDENT">Student</option>
						<option value="ADMIN">Admin</option>
					</select>
				</label>
				<label>
					Date of birth
					<input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} required />
				</label>
				<label>
					Team
					<input value={team} onChange={(event) => setTeam(event.target.value)} required />
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
						minLength={8}
					/>
				</label>
				<button type="submit">Create Account</button>
			</form>
			{error ? <p role="alert">{error}</p> : null}
		</section>
	);
}
