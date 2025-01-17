/*
  Warnings:

  - A unique constraint covering the columns `[place,city,postalCode]` on the table `CourseSessionLocation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "CourseSessionLocation_place_city_postalCode_idx" ON "CourseSessionLocation"("place", "city", "postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "CourseSessionLocation_place_city_postalCode_key" ON "CourseSessionLocation"("place", "city", "postalCode");
