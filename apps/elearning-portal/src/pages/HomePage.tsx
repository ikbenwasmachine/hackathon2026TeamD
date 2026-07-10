import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import type { EnrollmentDto } from "shared-types";
import { fetchEnrollments } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

export function HomePage(): ReactElement {
	const { studentId } = useCurrentUser();
	const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!studentId) {
			return;
		}
		fetchEnrollments(studentId)
			.then(setEnrollments)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load your courses");
			});
	}, [studentId]);

	if (!studentId) {
		return (
			<section>
				<h1>Welcome</h1>
				<p>
					Sign in as a student using the picker above, or <Link to="/signup">create an account</Link> to get started.
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
				<ul>
					{enrollments.map((enrollment) => (
						<li key={enrollment.id}>
							<Link to={`/courses/${enrollment.course.id}`}>{enrollment.course.title}</Link>
							<p>
								Progress: {enrollment.completedLessonIds.length} / {enrollment.totalLessons} lessons completed
							</p>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
