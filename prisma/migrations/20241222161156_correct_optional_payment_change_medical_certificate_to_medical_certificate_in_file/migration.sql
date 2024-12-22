/*
  Warnings:

  - You are about to drop the column `MedicalCertificate` on the `File` table. All the data in the column will be lost.
  - Added the required column `medicalCertificate` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "MedicalCertificate",
ADD COLUMN     "medicalCertificate" TEXT NOT NULL,
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "paymentDetails" DROP NOT NULL,
ALTER COLUMN "paymentAmout" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "photo" DROP DEFAULT;
