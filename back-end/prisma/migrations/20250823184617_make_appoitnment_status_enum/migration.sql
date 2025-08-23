/*
  Warnings:

  - The `status` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED');

-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "status",
ADD COLUMN     "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'PENDING';
