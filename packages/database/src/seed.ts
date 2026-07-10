import { prisma } from "./client";

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

        const course1 = await prisma.course.upsert({
            where: { id: "seed-course-1" },
            update: {
                level: "JUNIOR",
                assignments: ["Set up a TypeScript project", "Convert a JS file to strict TypeScript"],
            },
            create: {
                id: "seed-course-1",
                title: "Introduction to TypeScript",
                description: "Learn the fundamentals of TypeScript.",
                level: "JUNIOR",
                assignments: ["Set up a TypeScript project", "Convert a JS file to strict TypeScript"],
                published: true,
                instructorId: admin.id,
                lessons: {
                    create: [
                        { title: "Why TypeScript?", content: "Overview of static typing benefits.", order: 1 },
                        { title: "Basic Types", content: "Strings, numbers, booleans, arrays.", order: 2 },
                    ],
                },
            },
            include: { lessons: true },
        });

        const course2 = await prisma.course.upsert({
            where: { id: "seed-course-2" },
            update: {
                level: "MEDIOR",
                assignments: ["Build a component library", "Implement a form with validation", "Fetch and display API data"],
            },
            create: {
                id: "seed-course-2",
                title: "React Fundamentals",
                description: "Build interactive UIs with React.",
                level: "MEDIOR",
                assignments: ["Build a component library", "Implement a form with validation", "Fetch and display API data"],
                published: true,
                instructorId: admin.id,
                lessons: {
                    create: [
                        { title: "Components & Props", content: "Composing UI with components.", order: 1 },
                        { title: "State & Hooks", content: "Managing state with useState/useEffect.", order: 2 },
                        { title: "Handling Events", content: "Responding to user interaction.", order: 3 },
                    ],
                },
            },
        });

        const firstLessonId = course1.lessons[0]?.id;
        await prisma.enrollment.upsert({
            where: { studentId_courseId: { studentId: student1.id, courseId: course1.id } },
            update: { completedLessonIds: firstLessonId ? [firstLessonId] : [] },
            create: {
                studentId: student1.id,
                courseId: course1.id,
                completedLessonIds: firstLessonId ? [firstLessonId] : [],
            },
        });

        console.log(
            `Seeded admin ${admin.email}; students: ${student1.email}, ${student2.email}; courses: ${course1.title}, ${course2.title}`,
        );
    } finally {
        await prisma.$disconnect();
    }
}

void main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
