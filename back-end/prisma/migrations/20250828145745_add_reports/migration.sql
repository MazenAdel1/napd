-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_appointmentId_key" ON "public"."Report"("appointmentId");

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
