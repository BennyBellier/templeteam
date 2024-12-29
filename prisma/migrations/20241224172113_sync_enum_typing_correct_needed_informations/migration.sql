/*
  Warnings:

  - The values [CREATE,MODIFY,DELETE] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionType_new" AS ENUM ('Create', 'Modify', 'Delete');
ALTER TABLE "History" ALTER COLUMN "action" TYPE "ActionType_new" USING ("action"::text::"ActionType_new");
ALTER TYPE "ActionType" RENAME TO "ActionType_old";
ALTER TYPE "ActionType_new" RENAME TO "ActionType";
DROP TYPE "ActionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_courseId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_fileId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_legalGuardianId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_memberId_fkey";

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "photo" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_legalGuardianId_fkey" FOREIGN KEY ("legalGuardianId") REFERENCES "LegalGuardian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
