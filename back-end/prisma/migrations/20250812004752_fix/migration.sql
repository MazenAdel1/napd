-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "hasPastOperations" DROP NOT NULL,
ALTER COLUMN "pastOperationsDesc" DROP NOT NULL,
ALTER COLUMN "isTakingMedications" DROP NOT NULL,
ALTER COLUMN "medicationsDesc" DROP NOT NULL;
