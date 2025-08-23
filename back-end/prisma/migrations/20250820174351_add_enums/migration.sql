/*
  Warnings:

  - The `status` column on the `TimeSlot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."TimeSlotStatus" AS ENUM ('AVAILABLE', 'BOOKED');

-- AlterTable
ALTER TABLE "public"."TimeSlot" DROP COLUMN "status",
ADD COLUMN     "status" "public"."TimeSlotStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'CLIENT';
