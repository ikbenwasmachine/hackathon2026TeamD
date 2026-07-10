import { useEffect, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import type { AdminCourseDto, CourseLevel } from "shared-types";
import { createCourse, deleteCourse, fetchAdminCourses, updateCourse, uploadCoursePptx } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

const COURSE_LEVELS: CourseLevel[] = ["JUNIOR", "MEDIOR", "SENIOR"];

interface CourseFormState {
	title: string;
	description: string;
	level: CourseLevel;
	assignments: string;
	published: boolean;
}

const EMPTY_FORM: CourseFormState = {
	title: "",
	description: "",
	level: "JUNIOR",
	assignments: "",
	published: false,
};

function toAssignmentsList(value: string): string[] {
	return value
		.split(",")
		.map((assignment) => assignment.trim())
		.filter((assignment) => assignment.length > 0);
}

function CourseForm({
	initial,
	submitLabel,
	onSubmit,
}: {
	initial: CourseFormState;
	submitLabel: string;
	onSubmit: (form: CourseFormState) => void;
}): ReactElement {
	const [form, setForm] = useState<CourseFormState>(initial);

	function handleSubmit(): void {
		onSubmit(form);
	}

	return (
		<div>
			<label>
				Title
				<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
			</label>
			<label>
				Description
				<textarea
					value={form.description}
					onChange={(event) => setForm({ ...form, description: event.target.value })}
				/>
			</label>
			<label>
				Level
				<select
					value={form.level}
					onChange={(event) => setForm({ ...form, level: event.target.value as CourseLevel })}
				>
					{COURSE_LEVELS.map((level) => (
						<option key={level} value={level}>
							{level}
						</option>
					))}
				</select>
			</label>
			<label>
				Assignments (comma-separated)
				<input
					value={form.assignments}
					onChange={(event) => setForm({ ...form, assignments: event.target.value })}
				/>
			</label>
			<label>
				Published
				<input
					type="checkbox"
					checked={form.published}
					onChange={(event) => setForm({ ...form, published: event.target.checked })}
				/>
			</label>
			<button type="button" onClick={handleSubmit}>
				{submitLabel}
			</button>
		</div>
	);
}

export function AdminCoursesPage(): ReactElement {
	const { account } = useCurrentUser();
	const [courses, setCourses] = useState<AdminCourseDto[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [pptxFile, setPptxFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	function loadCourses(adminId: string): void {
		fetchAdminCourses(adminId)
			.then(setCourses)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load courses");
			});
	}

	function showSuccess(message: string): void {
		setError(null);
		setSuccessMessage(message);
		window.setTimeout(() => {
			setSuccessMessage(null);
		}, 4000);
	}

	useEffect(() => {
		if (account?.role === "ADMIN") {
			loadCourses(account.id);
		}
	}, [account]);

	if (!account || account.role !== "ADMIN") {
		return (
			<section>
				<h1>Admin</h1>
				<p>Sign in as an admin account to manage courses.</p>
			</section>
		);
	}

	function handleCreate(form: CourseFormState): void {
		if (!account) {
			return;
		}
		createCourse({
			adminId: account.id,
			title: form.title,
			description: form.description,
			level: form.level,
			assignments: toAssignmentsList(form.assignments),
			published: form.published,
		})
			.then(() => {
				loadCourses(account.id);
				showSuccess(`Course "${form.title}" was created successfully.`);
			})
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to create course");
			});
	}

	function handleUpdate(courseId: string, form: CourseFormState): void {
		if (!account) {
			return;
		}
		updateCourse(courseId, {
			adminId: account.id,
			title: form.title,
			description: form.description,
			level: form.level,
			assignments: toAssignmentsList(form.assignments),
			published: form.published,
		})
			.then(() => {
				loadCourses(account.id);
				showSuccess(`Changes to "${form.title}" were saved successfully.`);
			})
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to update course");
			});
	}

	function handleDelete(courseId: string, title: string): void {
		if (!account) {
			return;
		}
		if (!window.confirm(`Delete the course "${title}"? This cannot be undone.`)) {
			return;
		}
		deleteCourse(courseId, account.id)
			.then(() => {
				loadCourses(account.id);
				showSuccess(`Course "${title}" was deleted.`);
			})
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to delete course");
			});
	}

	function handlePptxFileChange(event: ChangeEvent<HTMLInputElement>): void {
		setPptxFile(event.target.files?.[0] ?? null);
	}

	function handlePptxUpload(): void {
		if (!account || !pptxFile) {
			return;
		}
		setUploading(true);
		uploadCoursePptx(account.id, pptxFile)
			.then(() => {
				setPptxFile(null);
				loadCourses(account.id);
			})
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to import PowerPoint file");
			})
			.finally(() => {
				setUploading(false);
			});
	}

	return (
		<section>
			<h1>Admin: Manage Courses</h1>
			{error ? <p role="alert">{error}</p> : null}
			{successMessage ? <p className="success-message">{successMessage}</p> : null}

			<h2>Create a new course</h2>
			<CourseForm initial={EMPTY_FORM} submitLabel="Create course" onSubmit={handleCreate} />

			<h2>Import from PowerPoint</h2>
			<p>Upload a .pptx file to create a new (unpublished) course with one lesson per slide.</p>
			<label>
				PowerPoint file
				<input type="file" accept=".pptx" onChange={handlePptxFileChange} />
			</label>
			<button type="button" disabled={!pptxFile || uploading} onClick={handlePptxUpload}>
				{uploading ? "Importing..." : "Import course"}
			</button>

			<h2>Existing courses</h2>
			<ul>
				{courses.map((course) => (
					<li key={course.id}>
						<CourseForm
							initial={{
								title: course.title,
								description: course.description,
								level: course.level,
								assignments: course.assignments.join(", "),
								published: course.published,
							}}
							submitLabel="Save changes"
							onSubmit={(form) => handleUpdate(course.id, form)}
						/>
						<button type="button" className="button-danger" onClick={() => handleDelete(course.id, course.title)}>
							Delete course
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}
