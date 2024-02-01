/*
  Warnings:

  - The primary key for the `References` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id,name]` on the table `References` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "References_id_key";

-- AlterTable
ALTER TABLE "References" DROP CONSTRAINT "References_pkey",
ADD CONSTRAINT "References_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "References_id_name_key" ON "References"("id", "name");
