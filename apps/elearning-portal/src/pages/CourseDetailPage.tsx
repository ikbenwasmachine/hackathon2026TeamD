import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import type { CourseDetailDto, EnrollmentDto } from "shared-types";
import { enrollInCourse, fetchCourse, fetchEnrollments, toggleLessonCompletion } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

export function CourseDetailPage(): ReactElement {
	const { id } = useParams<{ id: string }>();
	const { studentId } = useCurrentUser();
	const [course, setCourse] = useState<CourseDetailDto | null>(null);
	const [enrollment, setEnrollment] = useState<EnrollmentDto | null>(null);
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

	useEffect(() => {
		if (!id || !studentId) {
			setEnrollment(null);
			return;
		}
		fetchEnrollments(studentId)
			.then((enrollments) => {
				setEnrollment(enrollments.find((item) => item.course.id === id) ?? null);
			})
			.catch(() => {
				setEnrollment(null);
			});
	}, [id, studentId]);

	function handleEnroll(): void {
		if (!id || !studentId) {
			return;
		}
		enrollInCourse(studentId, id)
			.then(setEnrollment)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to enroll");
			});
	}

	function handleToggleLesson(lessonId: string, completed: boolean): void {
		if (!enrollment) {
			return;
		}
		toggleLessonCompletion(enrollment.id, lessonId, completed)
			.then(setEnrollment)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to update lesson progress");
			});
	}

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
			<p>Level: {course.level}</p>
			<p>Instructor: {course.instructorName}</p>
			<h2>Assignments</h2>
			<ul>
				{course.assignments.map((assignment) => (
					<li key={assignment}>{assignment}</li>
				))}
			</ul>
			<h2>Lessons</h2>
			{studentId && !enrollment ? (
				<button type="button" onClick={handleEnroll}>
					Enroll in this course
				</button>
			) : null}
			{enrollment ? (
				<p>
					Progress: {enrollment.completedLessonIds.length} / {enrollment.totalLessons} lessons completed
				</p>
			) : null}
			<ol>
				{course.lessons.map((lesson) => (
					<li key={lesson.id}>
						<h3>{lesson.title}</h3>
						<p>{lesson.content}</p>
						{enrollment ? (
							<label>
								<input
									type="checkbox"
									checked={enrollment.completedLessonIds.includes(lesson.id)}
									onChange={(event) => handleToggleLesson(lesson.id, event.target.checked)}
								/>
								Completed
							</label>
						) : null}
					</li>
				))}
			</ol>
		</section>
	);
}

