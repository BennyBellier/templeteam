/*
  Warnings:

  - You are about to drop the column `genderEnum` on the `Member` table. All the data in the column will be lost.
  - The `gender` column on the `Member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "gender";

ALTER TABLE "Member"
RENAME COLUMN "genderEnum" TO "gender";

-- CreateIndex
CREATE INDEX "Member_gender_idx" ON "Member"("gender");
