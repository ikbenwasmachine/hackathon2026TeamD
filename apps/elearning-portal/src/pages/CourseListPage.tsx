import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import type { CourseSummaryDto } from "shared-types";
import { fetchCourses } from "../api/client";

export function CourseListPage(): ReactElement {
	const [courses, setCourses] = useState<CourseSummaryDto[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchCourses()
			.then(setCourses)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load courses");
			});
	}, []);

	if (error) {
		return <p role="alert">{error}</p>;
	}

	return (
		<section>
			<h1>Courses</h1>
			<ul>
				{courses.map((course) => (
					<li key={course.id}>
						<Link to={`/courses/${course.id}`}>{course.title}</Link>
						<p>{course.description}</p>
						<p>Level: {course.level}</p>
						<p>Instructor: {course.instructorName}</p>
					</li>
				))}
			</ul>
		</section>
	);
}
