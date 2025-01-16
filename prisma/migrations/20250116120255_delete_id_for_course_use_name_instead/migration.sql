/*
  Warnings:

  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `CourseLocation` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseName]` on the table `CourseLocation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseName` to the `CourseLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseName` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseLocation" DROP CONSTRAINT "CourseLocation_courseId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_courseId_fkey";

-- DropForeignKey
ALTER TABLE "_FileCourses" DROP CONSTRAINT "_FileCourses_A_fkey";

-- DropIndex
DROP INDEX "Course_name_key";

-- DropIndex
DROP INDEX "CourseLocation_courseId_key";

-- DropIndex
DROP INDEX "History_courseId_action_idx";

-- DropIndex
DROP INDEX "Schedule_courseId_dayOfWeek_idx";

-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "CourseLocation" RENAME COLUMN "courseId" TO "courseName" ;

-- AlterTable
ALTER TABLE "History" RENAME COLUMN "courseId" TO "courseName";

-- AlterTable
ALTER TABLE "Schedule" RENAME COLUMN "courseId" TO "courseName";

-- CreateIndex
CREATE UNIQUE INDEX "CourseLocation_courseName_key" ON "CourseLocation"("courseName");

-- CreateIndex
CREATE INDEX "CourseLocation_courseName_idx" ON "CourseLocation"("courseName");

-- CreateIndex
CREATE INDEX "History_courseName_action_idx" ON "History"("courseName", "action");

-- CreateIndex
CREATE INDEX "Schedule_courseName_dayOfWeek_idx" ON "Schedule"("courseName", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "CourseLocation" ADD CONSTRAINT "CourseLocation_courseName_fkey" FOREIGN KEY ("courseName") REFERENCES "Course"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseName_fkey" FOREIGN KEY ("courseName") REFERENCES "Course"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_courseName_fkey" FOREIGN KEY ("courseName") REFERENCES "Course"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileCourses" ADD CONSTRAINT "_FileCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("name") ON DELETE CASCADE ON UPDATE CASCADE;
