/*
  Warnings:

  - Added the required column `signature` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `undersigner` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "signature" TEXT NOT NULL,
ADD COLUMN     "undersigner" TEXT NOT NULL;
