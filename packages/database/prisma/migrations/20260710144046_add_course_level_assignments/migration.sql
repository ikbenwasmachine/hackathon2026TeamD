-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('JUNIOR', 'MEDIOR', 'SENIOR');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "assignments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "level" "CourseLevel" NOT NULL DEFAULT 'JUNIOR';
