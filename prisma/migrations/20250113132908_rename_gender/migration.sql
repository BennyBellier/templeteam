/*
  Warnings:

  - You are about to drop the column `gender` on the `Member` table. All the data in the column will be lost.
  - Added the required column `genderS` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" RENAME COLUMN "gender" TO "genderS";
