import type { AppointmentActionProps } from "@/components/shared/appointments";
import { appointmentAction } from "@/components/shared/appointments/utils";

export const confirmAppointment = async ({
  ...props
}: Omit<AppointmentActionProps, "emitEvent">) => {
  appointmentAction({
    emitEvent: "confirm appointment",
    ...props,
  });
};
