-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'NotSpecified');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "genderEnum" "Gender" NOT NULL DEFAULT 'NotSpecified';
