/*
  Warnings:

  - You are about to drop the `FileCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FileCourses" DROP CONSTRAINT "FileCourses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "FileCourses" DROP CONSTRAINT "FileCourses_fileId_fkey";

-- DropTable
DROP TABLE "FileCourses";

-- CreateTable
CREATE TABLE "_FileCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FileCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FileCourses_B_index" ON "_FileCourses"("B");

-- AddForeignKey
ALTER TABLE "_FileCourses" ADD CONSTRAINT "_FileCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileCourses" ADD CONSTRAINT "_FileCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
