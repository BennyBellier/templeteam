/*
  Warnings:

  - Made the column `paymentStatus` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- Update
UPDATE "public"."File" SET "paymentStatus" = 'Overdue' WHERE "paymentStatus" IS NULL;

-- AlterTable
ALTER TABLE "public"."File" ALTER COLUMN "paymentStatus" SET NOT NULL,
ALTER COLUMN "paymentStatus" SET DEFAULT 'Overdue';
