/*
  Warnings:

  - Added the required column `courseId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "courseId" TEXT NOT NULL;
