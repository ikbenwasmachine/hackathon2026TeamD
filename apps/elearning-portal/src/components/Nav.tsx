import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import type { AccountDto } from "shared-types";
import { fetchStudents } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

export function Nav(): ReactElement {
	const { studentId, setStudentId } = useCurrentUser();
	const [students, setStudents] = useState<AccountDto[]>([]);

	useEffect(() => {
		fetchStudents()
			.then(setStudents)
			.catch(() => {
				setStudents([]);
			});
	}, [studentId]);

	return (
		<nav>
			<Link to="/">Home</Link> | <Link to="/courses">Courses</Link> | <Link to="/signup">Create Account</Link>{" "}
			<select value={studentId ?? ""} onChange={(event) => setStudentId(event.target.value)}>
				<option value="" disabled>
					Sign in as...
				</option>
				{students.map((student) => (
					<option key={student.id} value={student.id}>
						{student.name}
					</option>
				))}
			</select>
		</nav>
	);
}
