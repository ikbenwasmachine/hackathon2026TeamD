import { prisma } from "./client";

async function main(): Promise<void> {
    try {
        const instructor = await prisma.user.upsert({
            where: { email: "instructor@example.com" },
            update: {},
            create: {
                email: "instructor@example.com",
                passwordHash: "seed-placeholder",
                name: "Ada Instructor",
                role: "INSTRUCTOR",
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
                instructorId: instructor.id,
                lessons: {
                    create: [
                        { title: "Why TypeScript?", content: "Overview of static typing benefits.", order: 1 },
                        { title: "Basic Types", content: "Strings, numbers, booleans, arrays.", order: 2 },
                    ],
                },
            },
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
                instructorId: instructor.id,
                lessons: {
                    create: [
                        { title: "Components & Props", content: "Composing UI with components.", order: 1 },
                        { title: "State & Hooks", content: "Managing state with useState/useEffect.", order: 2 },
                        { title: "Handling Events", content: "Responding to user interaction.", order: 3 },
                    ],
                },
            },
        });

        console.log(`Seeded instructor ${instructor.email}; courses: ${course1.title}, ${course2.title}`);
    } finally {
        await prisma.$disconnect();
    }
}

void main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
