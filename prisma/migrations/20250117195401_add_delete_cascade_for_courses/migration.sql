-- DropForeignKey
ALTER TABLE "CourseSession" DROP CONSTRAINT "CourseSession_courseId_fkey";

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("name") ON DELETE CASCADE ON UPDATE CASCADE;
