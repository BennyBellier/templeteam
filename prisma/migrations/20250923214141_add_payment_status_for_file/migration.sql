-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('Paid', 'Overdue', 'Pending_collection', 'InPart_33', 'InPart_50', 'InPart_66', 'Waiting');

-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "paymentStatus" "public"."PaymentStatus";

-- CreateIndex
CREATE INDEX "File_season_idx" ON "public"."File"("season");
