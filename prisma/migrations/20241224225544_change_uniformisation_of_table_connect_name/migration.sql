/*
  Warnings:

  - You are about to drop the `_MemberToLegalGuardian` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MemberToLegalGuardian" DROP CONSTRAINT "_MemberToLegalGuardian_A_fkey";

-- DropForeignKey
ALTER TABLE "_MemberToLegalGuardian" DROP CONSTRAINT "_MemberToLegalGuardian_B_fkey";

-- DropTable
DROP TABLE "_MemberToLegalGuardian";

-- CreateTable
CREATE TABLE "_MemberLegalGuardian" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemberLegalGuardian_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MemberLegalGuardian_B_index" ON "_MemberLegalGuardian"("B");

-- AddForeignKey
ALTER TABLE "_MemberLegalGuardian" ADD CONSTRAINT "_MemberLegalGuardian_A_fkey" FOREIGN KEY ("A") REFERENCES "LegalGuardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberLegalGuardian" ADD CONSTRAINT "_MemberLegalGuardian_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
