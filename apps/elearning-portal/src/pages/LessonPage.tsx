import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import type { CourseDetailDto, EnrollmentDto, LessonDto, QuizSubmissionResultDto } from "shared-types";
import { fetchCourse, fetchEnrollments, submitLessonQuiz, toggleLessonCompletion } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

export function LessonPage(): ReactElement {
	const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
	const { account } = useCurrentUser();
	const isStudent = account?.role === "STUDENT";
	const [course, setCourse] = useState<CourseDetailDto | null>(null);
	const [enrollment, setEnrollment] = useState<EnrollmentDto | null>(null);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const [result, setResult] = useState<QuizSubmissionResultDto | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!courseId) {
			return;
		}
		fetchCourse(courseId)
			.then(setCourse)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load lesson");
			});
	}, [courseId]);

	useEffect(() => {
		if (!courseId || !isStudent || !account) {
			setEnrollment(null);
			return;
		}
		fetchEnrollments(account.id)
			.then((enrollments) => {
				setEnrollment(enrollments.find((item) => item.course.id === courseId) ?? null);
			})
			.catch(() => {
				setEnrollment(null);
			});
	}, [courseId, account, isStudent]);

	if (error) {
		return <p role="alert">{error}</p>;
	}

	if (!course) {
		return <p>Loading...</p>;
	}

	const lesson: LessonDto | undefined = course.lessons.find((item) => item.id === lessonId);

	if (!lesson) {
		return <p role="alert">Lesson not found.</p>;
	}

	if (!enrollment) {
		return (
			<section>
				<Link to={`/courses/${course.id}`}>Back to course</Link>
				<h1>{lesson.title}</h1>
				<p>Enroll in this course from the course page to track your progress on this lesson.</p>
			</section>
		);
	}

	const isCompleted = enrollment.completedLessonIds.includes(lesson.id);

	function handleSelectAnswer(questionIndex: number, optionIndex: number): void {
		setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
	}

	function handleSubmit(): void {
		if (!enrollment || !lessonId || !lesson) {
			return;
		}
		const orderedAnswers = lesson.questions.map((_, index) => answers[index] ?? -1);
		submitLessonQuiz(enrollment.id, lessonId, orderedAnswers)
			.then((submissionResult) => {
				setResult(submissionResult);
				setEnrollment(submissionResult.enrollment);
			})
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to submit quiz");
			});
	}

	function handleMarkComplete(): void {
		if (!enrollment || !lessonId) {
			return;
		}
		toggleLessonCompletion(enrollment.id, lessonId, true)
			.then(setEnrollment)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to mark lesson complete");
			});
	}

	return (
		<section>
			<Link to={`/courses/${course.id}`}>Back to course</Link>
			<h1>{lesson.title}</h1>
			{isCompleted ? <p className="success-message">Completed</p> : null}
			<p style={{ whiteSpace: "pre-wrap" }}>{lesson.content}</p>

			{lesson.questions.length === 0 ? (
				<button type="button" disabled={isCompleted} onClick={handleMarkComplete}>
					{isCompleted ? "Completed" : "Mark as complete"}
				</button>
			) : (
				<>
					<h2>Check your knowledge</h2>
					{lesson.questions.map((question, questionIndex) => (
						<div className="quiz-question" key={question.id}>
							<p>{question.question}</p>
							{question.options.map((option, optionIndex) => (
								<label className="quiz-option" key={option}>
									<input
										type="radio"
										name={`question-${questionIndex}`}
										checked={answers[questionIndex] === optionIndex}
										onChange={() => handleSelectAnswer(questionIndex, optionIndex)}
									/>
									{option}
								</label>
							))}
							{result ? (
								result.correctness[questionIndex] ? (
									<p className="quiz-result-correct">Correct</p>
								) : (
									<p className="quiz-result-incorrect">Incorrect</p>
								)
							) : null}
						</div>
					))}
					<button type="button" onClick={handleSubmit}>
						Submit answers
					</button>
					{result ? (
						result.allCorrect ? (
							<p className="success-message">All correct! This lesson is now marked as completed.</p>
						) : (
							<p role="alert">Not all answers were correct yet. Review the content and try again.</p>
						)
					) : null}
				</>
			)}
		</section>
	);
}
