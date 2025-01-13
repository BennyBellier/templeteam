/*
  Warnings:

  - You are about to drop the column `genderS` on the `Member` table. All the data in the column will be lost.
  - Added the required column `gender` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" RENAME COLUMN "genderS" TO "gender";

-- CreateIndex
CREATE INDEX "Member_gender_idx" ON "Member"("gender");
