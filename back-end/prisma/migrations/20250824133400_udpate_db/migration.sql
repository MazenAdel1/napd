/*
  Warnings:

  - A unique constraint covering the columns `[timeSlotId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_timeSlotId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_timeSlotId_key" ON "public"."Appointment"("timeSlotId");

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "public"."TimeSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
