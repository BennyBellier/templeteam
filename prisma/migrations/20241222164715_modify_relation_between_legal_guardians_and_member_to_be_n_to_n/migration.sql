/*
  Warnings:

  - You are about to drop the column `memberId` on the `LegalGuardian` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LegalGuardian" DROP CONSTRAINT "LegalGuardian_memberId_fkey";

-- AlterTable
ALTER TABLE "LegalGuardian" DROP COLUMN "memberId";

-- CreateTable
CREATE TABLE "_MemberToLegalGuardian" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemberToLegalGuardian_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MemberToLegalGuardian_B_index" ON "_MemberToLegalGuardian"("B");

-- AddForeignKey
ALTER TABLE "_MemberToLegalGuardian" ADD CONSTRAINT "_MemberToLegalGuardian_A_fkey" FOREIGN KEY ("A") REFERENCES "LegalGuardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberToLegalGuardian" ADD CONSTRAINT "_MemberToLegalGuardian_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
