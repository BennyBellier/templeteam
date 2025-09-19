/*
  Warnings:

  - You are about to drop the column `year` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[season,memberId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."File_year_memberId_idx";

-- DropIndex
DROP INDEX "public"."File_year_memberId_key";

-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN "season" TEXT NULL;

-- Update
UPDATE "public"."File"
SET "season" = to_char("year", 'YYYY') || '/' || to_char("year" + interval '1 year', 'YYYY');

-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "year",
ALTER COLUMN     "season" SET NOT NULL;

-- CreateIndex
CREATE INDEX "File_season_memberId_idx" ON "public"."File"("season", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "File_season_memberId_key" ON "public"."File"("season" DESC, "memberId");
