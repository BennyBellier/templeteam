/*
  Warnings:

  - A unique constraint covering the columns `[lastname,firstname,phone]` on the table `LegalGuardian` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LegalGuardian_lastname_firstname_phone_key" ON "LegalGuardian"("lastname", "firstname", "phone");
