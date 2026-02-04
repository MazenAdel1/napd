import { Badge } from "@/components/ui/badge";
import { getHoursMinutes } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import type { AppointmentCardBaseProps } from "./types";
import { weekdays } from "@/lib/consts";

export default function AppointmentCardBase({
  appointment,
  actions,
}: AppointmentCardBaseProps) {
  const formattedDate = format(appointment.timeSlot.date, "dd-MM-yyyy");
  const day = weekdays[new Date(appointment.timeSlot.date).getDay()];

  return (
    <div
      key={appointment.id}
      className="relative flex flex-col rounded-md border bg-white p-3 shadow"
    >
      <div>
        {appointment.status === "CONFIRMED" && (
          <Badge variant={"success"} className="text-base">
            <CheckCircle2 className="size-4!" />
            تم تأكيد الحجز
          </Badge>
        )}
        {appointment.status === "PENDING" && (
          <Badge variant={"note"} className="text-base">
            <Clock className="size-4!" />
            في انتظار تأكيد الحجز
          </Badge>
        )}
      </div>
      <div className="my-auto flex flex-col py-4">
        <h2 className="text-xl font-semibold">{appointment.user.name}</h2>
        <h3 className="mb-2 text-lg font-light text-gray-600">
          {appointment.user.phoneNumber}
        </h3>
        <p className="text-gray-700">
          يوم {day} {formattedDate}
        </p>
        <div className="flex items-center gap-1 font-medium">
          <div>{getHoursMinutes(appointment.timeSlot.startTime)}</div>
          <ArrowLeft className="size-4" />
          <div>{getHoursMinutes(appointment.timeSlot.endTime)}</div>
        </div>
      </div>

      {/* Actions slot (confirm/cancel buttons, report) */}
      {actions}
    </div>
  );
}
