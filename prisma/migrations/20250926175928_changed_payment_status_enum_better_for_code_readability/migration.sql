/*
  Warnings:

  - The values [Pending_collection,InPart_33,InPart_50,InPart_66,Waiting] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentStatus_new" AS ENUM ('Paid', 'Overdue', 'PendingCollection', 'InPart33', 'InPart50', 'InPart66', 'ToBeCashed');
ALTER TABLE "public"."File" ALTER COLUMN "paymentStatus" TYPE "public"."PaymentStatus_new" USING ("paymentStatus"::text::"public"."PaymentStatus_new");
ALTER TYPE "public"."PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "public"."PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
COMMIT;
