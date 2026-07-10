import { prisma } from "./client";
import type { CourseLevel } from "@prisma/client";

interface SeedQuizQuestion {
    question: string;
    options: string[];
    correctOptionIndex: number;
}

interface SeedLesson {
    title: string;
    content: string;
    questions: SeedQuizQuestion[];
}

interface SeedCourse {
    id: string;
    title: string;
    description: string;
    level: CourseLevel;
    assignments: string[];
    lessons: SeedLesson[];
}

async function upsertCourseWithLessons(course: SeedCourse, instructorId: string): Promise<void> {
    const created = await prisma.course.upsert({
        where: { id: course.id },
        update: {
            level: course.level,
            assignments: course.assignments,
        },
        create: {
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level,
            assignments: course.assignments,
            published: true,
            instructorId,
        },
    });

    await prisma.lesson.deleteMany({ where: { courseId: created.id } });
    await prisma.course.update({
        where: { id: created.id },
        data: {
            lessons: {
                create: course.lessons.map((lesson, index) => ({
                    title: lesson.title,
                    content: lesson.content,
                    order: index + 1,
                    questions: {
                        create: lesson.questions.map((question, questionIndex) => ({
                            question: question.question,
                            options: question.options,
                            correctOptionIndex: question.correctOptionIndex,
                            order: questionIndex + 1,
                        })),
                    },
                })),
            },
        },
    });
}

const seedCourses: SeedCourse[] = [
    {
        id: "seed-course-1",
        title: "Introduction to TypeScript",
        description: "Learn the fundamentals of TypeScript.",
        level: "JUNIOR",
        assignments: ["Set up a TypeScript project", "Convert a JS file to strict TypeScript"],
        lessons: [
            {
                title: "Why TypeScript?",
                content: "Overview of static typing benefits.",
                questions: [
                    {
                        question: "What is a key benefit of TypeScript mentioned in this lesson?",
                        options: ["Static typing", "Slower runtime", "No compiler needed", "Removes all bugs"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "Basic Types",
                content: "Strings, numbers, booleans, arrays.",
                questions: [
                    {
                        question: "Which of the following is a basic TypeScript type covered in this lesson?",
                        options: ["Promise", "string", "Symbol", "WeakMap"],
                        correctOptionIndex: 1,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-2",
        title: "React Fundamentals",
        description: "Build interactive UIs with React.",
        level: "MEDIOR",
        assignments: ["Build a component library", "Implement a form with validation", "Fetch and display API data"],
        lessons: [
            {
                title: "Components & Props",
                content: "Composing UI with components.",
                questions: [
                    {
                        question: "What do you use to compose UI in React, as covered in this lesson?",
                        options: ["Components", "Middlewares", "Migrations", "Containers"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "State & Hooks",
                content: "Managing state with useState/useEffect.",
                questions: [
                    {
                        question: "Which hooks are mentioned in this lesson for managing state and effects?",
                        options: ["useState only", "useEffect only", "Both useState and useEffect", "Neither"],
                        correctOptionIndex: 2,
                    },
                ],
            },
            {
                title: "Handling Events",
                content: "Responding to user interaction.",
                questions: [
                    {
                        question: "What does this lesson focus on?",
                        options: ["Responding to user interaction", "Server-side rendering", "Database queries", "CSS animations"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-3",
        title: "Node.js Backend Basics",
        description: "Build server-side applications with Node.js.",
        level: "MEDIOR",
        assignments: ["Create an HTTP server", "Read and write files with the fs module"],
        lessons: [
            {
                title: "The Node.js Runtime",
                content: "How Node.js runs JavaScript outside the browser using the V8 engine and an event loop.",
                questions: [
                    {
                        question: "What engine does Node.js use to run JavaScript?",
                        options: ["V8", "SpiderMonkey", "Chakra", "JavaScriptCore"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "Modules & npm",
                content: "Organizing code with CommonJS/ES modules and managing dependencies with npm.",
                questions: [
                    {
                        question: "Which tool is used to manage Node.js dependencies, per this lesson?",
                        options: ["npm", "pip", "composer", "maven"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-4",
        title: "Advanced CSS & Layout",
        description: "Master modern CSS layout techniques.",
        level: "JUNIOR",
        assignments: ["Build a responsive grid layout", "Center elements with Flexbox"],
        lessons: [
            {
                title: "Flexbox Basics",
                content: "Aligning and distributing items along a single axis with display: flex.",
                questions: [
                    {
                        question: "Flexbox arranges items along how many axes at once, as taught in this lesson?",
                        options: ["One (main axis, with a cross axis)", "Three", "Zero", "Five"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "CSS Grid",
                content: "Creating two-dimensional layouts with display: grid, rows, and columns.",
                questions: [
                    {
                        question: "What kind of layout does CSS Grid create, according to this lesson?",
                        options: ["Two-dimensional", "One-dimensional only", "Only vertical", "Only horizontal"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-5",
        title: "Database Design with SQL",
        description: "Design relational databases and write SQL queries.",
        level: "MEDIOR",
        assignments: ["Design a normalized schema", "Write JOIN queries across three tables"],
        lessons: [
            {
                title: "Tables & Relationships",
                content: "Modeling entities as tables and connecting them with foreign keys.",
                questions: [
                    {
                        question: "What connects two related tables, per this lesson?",
                        options: ["A foreign key", "A CSS class", "A cookie", "An index.html file"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "Writing Queries",
                content: "Using SELECT, WHERE, and JOIN to retrieve data across tables.",
                questions: [
                    {
                        question: "Which SQL clause combines rows from two tables, as covered here?",
                        options: ["JOIN", "IMPORT", "MERGE FILE", "LINK"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-6",
        title: "Testing with Jest",
        description: "Write reliable unit and integration tests with Jest.",
        level: "MEDIOR",
        assignments: ["Write unit tests for a utility module", "Mock an external API call"],
        lessons: [
            {
                title: "Writing Your First Test",
                content: "Using describe/it/expect to assert behavior.",
                questions: [
                    {
                        question: "Which function is used to make an assertion in Jest, as shown in this lesson?",
                        options: ["expect", "assertTrue", "check", "verify"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "Mocking Dependencies",
                content: "Replacing real modules or functions with mocks to isolate the code under test.",
                questions: [
                    {
                        question: "What is the purpose of mocking, according to this lesson?",
                        options: ["Isolating code under test from dependencies", "Making tests slower", "Deleting test files", "Styling components"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-7",
        title: "Git & Version Control",
        description: "Track changes and collaborate on code with Git.",
        level: "JUNIOR",
        assignments: ["Create a repository and make three commits", "Resolve a merge conflict"],
        lessons: [
            {
                title: "Commits & Branches",
                content: "Recording snapshots of your project and working in parallel with branches.",
                questions: [
                    {
                        question: "What lets you work on a feature in parallel without affecting the main codebase, per this lesson?",
                        options: ["A branch", "A comment", "A tag", "A README"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "Merging & Conflicts",
                content: "Combining branches with merge and resolving conflicting changes.",
                questions: [
                    {
                        question: "What happens when two branches change the same line differently, as described here?",
                        options: ["A merge conflict", "An automatic fix", "A deleted file", "Nothing"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-8",
        title: "REST API Design",
        description: "Design clean, predictable HTTP APIs.",
        level: "MEDIOR",
        assignments: ["Design endpoints for a resource with full CRUD", "Add proper HTTP status codes to responses"],
        lessons: [
            {
                title: "Resources & Verbs",
                content: "Modeling resources as URLs and using GET/POST/PATCH/DELETE appropriately.",
                questions: [
                    {
                        question: "Which HTTP verb is used to partially update a resource, as taught in this lesson?",
                        options: ["PATCH", "GET", "OPTIONS", "HEAD"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "Status Codes",
                content: "Communicating outcomes with 2xx, 4xx, and 5xx status codes.",
                questions: [
                    {
                        question: "Which status code range indicates a client error, per this lesson?",
                        options: ["4xx", "2xx", "1xx", "5xx"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-9",
        title: "Docker Fundamentals",
        description: "Package and run applications in containers.",
        level: "SENIOR",
        assignments: ["Write a Dockerfile for a Node.js app", "Run a multi-container app with docker-compose"],
        lessons: [
            {
                title: "Images & Containers",
                content: "Building images with a Dockerfile and running them as containers.",
                questions: [
                    {
                        question: "What file defines how a Docker image is built, according to this lesson?",
                        options: ["Dockerfile", "package.json", "docker.yml", "image.config"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "docker-compose",
                content: "Defining and running multi-container applications with a single YAML file.",
                questions: [
                    {
                        question: "What does docker-compose let you define, per this lesson?",
                        options: ["Multi-container applications", "CSS themes", "Git branches", "SQL schemas"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-10",
        title: "System Design Basics",
        description: "Learn foundational concepts for designing scalable systems.",
        level: "SENIOR",
        assignments: ["Sketch the architecture for a URL shortener", "Identify bottlenecks in a given system diagram"],
        lessons: [
            {
                title: "Scaling Strategies",
                content: "Vertical vs. horizontal scaling, load balancing, and caching.",
                questions: [
                    {
                        question: "Adding more machines instead of a bigger machine is an example of what, per this lesson?",
                        options: ["Horizontal scaling", "Vertical scaling", "Caching", "Sharding only"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "Databases at Scale",
                content: "Replication, sharding, and choosing between SQL and NoSQL.",
                questions: [
                    {
                        question: "What technique splits a database across multiple machines by key, as covered here?",
                        options: ["Sharding", "Minification", "Bundling", "Transpiling"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-11",
        title: "Python for Data Analysis",
        description: "Use Python to explore and analyze datasets.",
        level: "JUNIOR",
        assignments: ["Load a CSV into a DataFrame and summarize it", "Create a chart from a dataset"],
        lessons: [
            {
                title: "Working with DataFrames",
                content: "Using pandas DataFrames to load, inspect, and filter tabular data.",
                questions: [
                    {
                        question: "Which library provides the DataFrame structure covered in this lesson?",
                        options: ["pandas", "requests", "flask", "numpy only"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "Basic Visualization",
                content: "Plotting simple charts to spot trends in your data.",
                questions: [
                    {
                        question: "What is a primary goal of visualizing data, according to this lesson?",
                        options: ["Spotting trends in the data", "Encrypting the data", "Compiling the data", "Deleting the data"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
    {
        id: "seed-course-12",
        title: "Cloud Deployment with AWS",
        description: "Deploy and host applications on AWS.",
        level: "SENIOR",
        assignments: ["Deploy a static site to S3", "Configure a basic CI/CD pipeline to deploy on push"],
        lessons: [
            {
                title: "Core AWS Services",
                content: "An overview of S3, EC2, and RDS and when to use each.",
                questions: [
                    {
                        question: "Which AWS service is primarily used for object storage, as taught in this lesson?",
                        options: ["S3", "EC2", "RDS", "Lambda only"],
                        correctOptionIndex: 0,
                    },
                ],
            },
            {
                title: "CI/CD Pipelines",
                content: "Automating build, test, and deploy steps whenever code is pushed.",
                questions: [
                    {
                        question: "What triggers a CI/CD pipeline in the workflow described here?",
                        options: ["A code push", "A coffee break", "A manual email", "A file rename"],
                        correctOptionIndex: 0,
                    },
                ],
            },
        ],
    },
];

async function main(): Promise<void> {
    try {
        const admin = await prisma.user.upsert({
            where: { email: "admin@example.com" },
            update: {},
            create: {
                email: "admin@example.com",
                passwordHash: "seed-placeholder",
                name: "Ada Admin",
                role: "ADMIN",
            },
        });

        const student1 = await prisma.user.upsert({
            where: { email: "grace.student@example.com" },
            update: {},
            create: {
                email: "grace.student@example.com",
                passwordHash: "seed-placeholder",
                name: "Grace Student",
                role: "STUDENT",
                dateOfBirth: new Date("2000-04-12"),
                team: "Team Falcon",
            },
        });

        const student2 = await prisma.user.upsert({
            where: { email: "sam.student@example.com" },
            update: {},
            create: {
                email: "sam.student@example.com",
                passwordHash: "seed-placeholder",
                name: "Sam Student",
                role: "STUDENT",
                dateOfBirth: new Date("2001-09-30"),
                team: "Team Kestrel",
            },
        });

        for (const course of seedCourses) {
            await upsertCourseWithLessons(course, admin.id);
        }

        const course1Lessons = await prisma.lesson.findMany({
            where: { courseId: "seed-course-1" },
            orderBy: { order: "asc" },
        });

        const firstLessonId = course1Lessons[0]?.id;
        await prisma.enrollment.upsert({
            where: { studentId_courseId: { studentId: student1.id, courseId: "seed-course-1" } },
            update: { completedLessonIds: firstLessonId ? [firstLessonId] : [] },
            create: {
                studentId: student1.id,
                courseId: "seed-course-1",
                completedLessonIds: firstLessonId ? [firstLessonId] : [],
            },
        });

        console.log(
            `Seeded admin ${admin.email}; students: ${student1.email}, ${student2.email}; courses: ${seedCourses.map((course) => course.title).join(", ")}`,
        );
    } finally {
        await prisma.$disconnect();
    }
}

void main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
