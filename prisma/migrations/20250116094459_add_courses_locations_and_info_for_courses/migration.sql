-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "info" TEXT,
ALTER COLUMN "price" DROP DEFAULT;

-- CreateTable
CREATE TABLE "CourseLocation" (
    "id" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "appleLocation" TEXT NOT NULL,
    "googleLocation" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseLocation_courseId_key" ON "CourseLocation"("courseId");

-- AddForeignKey
ALTER TABLE "CourseLocation" ADD CONSTRAINT "CourseLocation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
