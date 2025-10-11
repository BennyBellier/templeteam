/*
  Warnings:

  - You are about to drop the column `paymentAmout` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "paymentAmout",
ADD COLUMN     "paymentAmount" DOUBLE PRECISION;
