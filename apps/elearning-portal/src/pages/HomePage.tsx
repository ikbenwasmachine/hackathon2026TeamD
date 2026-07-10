import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import type { EnrollmentDto } from "shared-types";
import { fetchEnrollments } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

export function HomePage(): ReactElement {
	const { account } = useCurrentUser();
	const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!account || account.role !== "STUDENT") {
			return;
		}
		fetchEnrollments(account.id)
			.then(setEnrollments)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load your courses");
			});
	}, [account]);

	if (!account) {
		return (
			<section>
				<h1>Welcome</h1>
				<p>
					Sign in using the picker above, or <Link to="/signup">create an account</Link> to get started.
				</p>
			</section>
		);
	}

	if (account.role === "ADMIN") {
		return (
			<section>
				<h1>Welcome, {account.name}</h1>
				<p>
					You&apos;re signed in as an admin. Visit the <Link to="/admin">Admin</Link> area to manage courses.
				</p>
			</section>
		);
	}

	if (error) {
		return <p role="alert">{error}</p>;
	}

	return (
		<section>
			<h1>My Courses</h1>
			{enrollments.length === 0 ? (
				<p>
					You haven&apos;t applied to any courses yet. <Link to="/courses">Browse courses</Link> to get started.
				</p>
			) : (
				<ul className="course-grid">
					{enrollments.map((enrollment) => {
						const percent =
							enrollment.totalLessons === 0
								? 0
								: Math.round((enrollment.completedLessonIds.length / enrollment.totalLessons) * 100);
						return (
							<li key={enrollment.id} className="course-card">
								<Link to={`/courses/${enrollment.course.id}`}>
									<h3>{enrollment.course.title}</h3>
								</Link>
								<div className="progress-bar">
									<div className="progress-bar-fill" style={{ width: `${percent}%` }} />
								</div>
								<p>
									{enrollment.completedLessonIds.length} / {enrollment.totalLessons} lessons completed
								</p>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}
