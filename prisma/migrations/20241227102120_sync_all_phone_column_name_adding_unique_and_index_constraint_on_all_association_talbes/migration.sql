/*
  Warnings:

  - You are about to drop the column `description` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year,memberId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lastname,firstname,birthdate]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Member_firstname_lastname_birthdate_key";

-- DropIndex
DROP INDEX "Member_phoneNumber_key";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 180.00;

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "medicalCertificate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "History" DROP COLUMN "description",
ADD COLUMN     "data" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "Course_name_idx" ON "Course"("name");

-- CreateIndex
CREATE INDEX "Course_price_idx" ON "Course"("price" ASC);

-- CreateIndex
CREATE INDEX "File_memberId_idx" ON "File"("memberId");

-- CreateIndex
CREATE INDEX "File_year_memberId_idx" ON "File"("year", "memberId");

-- CreateIndex
CREATE INDEX "File_paymentMethod_idx" ON "File"("paymentMethod");

-- CreateIndex
CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "File_year_memberId_key" ON "File"("year" DESC, "memberId");

-- CreateIndex
CREATE INDEX "History_action_dateAction_idx" ON "History"("action", "dateAction");

-- CreateIndex
CREATE INDEX "History_memberId_action_idx" ON "History"("memberId", "action");

-- CreateIndex
CREATE INDEX "History_legalGuardianId_action_idx" ON "History"("legalGuardianId", "action");

-- CreateIndex
CREATE INDEX "History_fileId_action_idx" ON "History"("fileId", "action");

-- CreateIndex
CREATE INDEX "History_courseId_action_idx" ON "History"("courseId", "action");

-- CreateIndex
CREATE INDEX "LegalGuardian_lastname_firstname_idx" ON "LegalGuardian"("lastname", "firstname");

-- CreateIndex
CREATE INDEX "LegalGuardian_mail_idx" ON "LegalGuardian"("mail");

-- CreateIndex
CREATE INDEX "LegalGuardian_phone_idx" ON "LegalGuardian"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Member_phone_key" ON "Member"("phone");

-- CreateIndex
CREATE INDEX "Member_lastname_firstname_birthdate_idx" ON "Member"("lastname", "firstname", "birthdate");

-- CreateIndex
CREATE INDEX "Member_gender_idx" ON "Member"("gender");

-- CreateIndex
CREATE INDEX "Member_address_city_postalCode_country_idx" ON "Member"("address", "city", "postalCode", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Member_lastname_firstname_birthdate_key" ON "Member"("lastname" ASC, "firstname" ASC, "birthdate");

-- CreateIndex
CREATE INDEX "Schedule_dayOfWeek_idx" ON "Schedule"("dayOfWeek");

-- CreateIndex
CREATE INDEX "Schedule_startHour_idx" ON "Schedule"("startHour");

-- CreateIndex
CREATE INDEX "Schedule_endHour_idx" ON "Schedule"("endHour");

-- CreateIndex
CREATE INDEX "Schedule_courseId_dayOfWeek_idx" ON "Schedule"("courseId", "dayOfWeek");
