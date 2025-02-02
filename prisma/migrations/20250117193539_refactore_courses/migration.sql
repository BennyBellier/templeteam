/*
  Warnings:

  - You are about to drop the `CourseLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseLocation" DROP CONSTRAINT "CourseLocation_courseName_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_courseName_fkey";

-- DropTable
DROP TABLE "CourseLocation";

-- DropTable
DROP TABLE "Schedule";

-- CreateTable
CREATE TABLE "CourseSessionLocation" (
    "id" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSessionLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSession" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startHour" TIMESTAMP(3) NOT NULL,
    "endHour" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseSession_dayOfWeek_idx" ON "CourseSession"("dayOfWeek");

-- CreateIndex
CREATE INDEX "CourseSession_startHour_idx" ON "CourseSession"("startHour");

-- CreateIndex
CREATE INDEX "CourseSession_endHour_idx" ON "CourseSession"("endHour");

-- CreateIndex
CREATE INDEX "CourseSession_courseId_dayOfWeek_idx" ON "CourseSession"("courseId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "CourseSession_dayOfWeek_startHour_locationId_key" ON "CourseSession"("dayOfWeek", "startHour", "locationId");

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "CourseSessionLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("name") ON DELETE CASCADE ON UPDATE CASCADE;
