/*
  Warnings:

  - The primary key for the `References` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `References` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId]` on the table `References` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `References` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "References" DROP CONSTRAINT "References_pkey",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "img" DROP NOT NULL,
ALTER COLUMN "href" DROP NOT NULL,
ALTER COLUMN "href" SET DATA TYPE TEXT,
ALTER COLUMN "alt" SET DATA TYPE TEXT,
ADD CONSTRAINT "References_pkey" PRIMARY KEY ("id", "name");

-- CreateTable
CREATE TABLE "ReferenceCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ReferenceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "References_id_key" ON "References"("id");

-- CreateIndex
CREATE UNIQUE INDEX "References_categoryId_key" ON "References"("categoryId");

-- AddForeignKey
ALTER TABLE "References" ADD CONSTRAINT "References_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReferenceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
