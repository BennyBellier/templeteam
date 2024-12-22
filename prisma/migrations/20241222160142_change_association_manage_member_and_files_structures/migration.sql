/*
  Warnings:

  - You are about to drop the column `picture` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `undersigner` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the `EmergencyContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalCertificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberEmergencyContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberMembership` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mail]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE', 'MODIFY', 'DELETE');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Transfer', 'Cheque', 'Card');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'Guest';

-- DropForeignKey
ALTER TABLE "MedicalCertificate" DROP CONSTRAINT "MedicalCertificate_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberEmergencyContact" DROP CONSTRAINT "MemberEmergencyContact_emergencyContactId_fkey";

-- DropForeignKey
ALTER TABLE "MemberEmergencyContact" DROP CONSTRAINT "MemberEmergencyContact_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberMembership" DROP CONSTRAINT "MemberMembership_memberId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "picture",
DROP COLUMN "signature",
DROP COLUMN "undersigner",
ADD COLUMN     "photo" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "EmergencyContact";

-- DropTable
DROP TABLE "MedicalCertificate";

-- DropTable
DROP TABLE "MemberEmergencyContact";

-- DropTable
DROP TABLE "MemberMembership";

-- DropEnum
DROP TYPE "Membership";

-- CreateTable
CREATE TABLE "LegalGuardian" (
    "id" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "mail" TEXT,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalGuardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "MedicalCertificate" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentDetails" TEXT NOT NULL,
    "paymentAmout" DOUBLE PRECISION NOT NULL,
    "undersigner" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileCourses" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileCourses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startHour" TIMESTAMP(3) NOT NULL,
    "endHour" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "description" TEXT NOT NULL,
    "dateAction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT,
    "legalGuardianId" TEXT,
    "fileId" TEXT,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LegalGuardian_phone_key" ON "LegalGuardian"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "LegalGuardian_mail_key" ON "LegalGuardian"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Member_mail_key" ON "Member"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Member_phoneNumber_key" ON "Member"("phoneNumber");

-- AddForeignKey
ALTER TABLE "LegalGuardian" ADD CONSTRAINT "LegalGuardian_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileCourses" ADD CONSTRAINT "FileCourses_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileCourses" ADD CONSTRAINT "FileCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_legalGuardianId_fkey" FOREIGN KEY ("legalGuardianId") REFERENCES "LegalGuardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
