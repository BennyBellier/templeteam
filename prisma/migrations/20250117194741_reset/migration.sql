-- DropForeignKey
ALTER TABLE "CourseSession" DROP CONSTRAINT "CourseSession_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseSession" DROP CONSTRAINT "CourseSession_locationId_fkey";

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "CourseSessionLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
