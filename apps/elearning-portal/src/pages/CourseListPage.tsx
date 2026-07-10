import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import type { CourseSummaryDto } from "shared-types";
import { enrollInCourse, fetchCourses, fetchEnrollments } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

export function CourseListPage(): ReactElement {
	const { account } = useCurrentUser();
	const isStudent = account?.role === "STUDENT";
	const [courses, setCourses] = useState<CourseSummaryDto[]>([]);
	const [appliedCourseIds, setAppliedCourseIds] = useState<Set<string>>(new Set());
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchCourses()
			.then(setCourses)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load courses");
			});
	}, []);

	useEffect(() => {
		if (!isStudent || !account) {
			setAppliedCourseIds(new Set());
			return;
		}
		fetchEnrollments(account.id)
			.then((enrollments) => {
				setAppliedCourseIds(new Set(enrollments.map((enrollment) => enrollment.course.id)));
			})
			.catch(() => {
				setAppliedCourseIds(new Set());
			});
	}, [account, isStudent]);

	function handleApply(courseId: string): void {
		if (!isStudent || !account) {
			return;
		}
		enrollInCourse(account.id, courseId)
			.then(() => {
				setAppliedCourseIds((current) => new Set(current).add(courseId));
			})
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to apply for course");
			});
	}

	if (error) {
		return <p role="alert">{error}</p>;
	}

	return (
		<section>
			<h1>Courses</h1>
			<ul className="course-grid">
				{courses.map((course) => (
					<li key={course.id} className="course-card">
						<span className="badge">{course.level}</span>
						<Link to={`/courses/${course.id}`}>
							<h3>{course.title}</h3>
						</Link>
						<p>{course.description}</p>
						<p>Instructor: {course.instructorName}</p>
						{isStudent ? (
							appliedCourseIds.has(course.id) ? (
								<p>Applied</p>
							) : (
								<button type="button" onClick={() => handleApply(course.id)}>
									Apply
								</button>
							)
						) : null}
					</li>
				))}
			</ul>
		</section>
	);
}
