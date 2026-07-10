import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import type { CourseDetailDto } from "shared-types";
import { fetchCourse } from "../api/client";

export function CourseDetailPage(): ReactElement {
	const { id } = useParams<{ id: string }>();
	const [course, setCourse] = useState<CourseDetailDto | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) {
			return;
		}
		fetchCourse(id)
			.then(setCourse)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load course");
			});
	}, [id]);

	if (error) {
		return <p role="alert">{error}</p>;
	}

	if (!course) {
		return <p>Loading...</p>;
	}

	return (
		<section>
			<Link to="/">Back to courses</Link>
			<h1>{course.title}</h1>
			<p>{course.description}</p>
			<p>Instructor: {course.instructorName}</p>
			<h2>Lessons</h2>
			<ol>
				{course.lessons.map((lesson) => (
					<li key={lesson.id}>
						<h3>{lesson.title}</h3>
						<p>{lesson.content}</p>
					</li>
				))}
			</ol>
		</section>
	);
}
