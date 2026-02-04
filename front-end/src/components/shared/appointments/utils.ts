import { socket } from "@/lib/consts";
import { toast } from "sonner";
import type { AppointmentActionProps } from "./types";

export const appointmentAction = async ({
  emitEvent,
  appointmentId,
  setIsSubmitting,
  closeRef,
}: AppointmentActionProps) => {
  try {
    setIsSubmitting(true);
    socket.emit(emitEvent, { appointmentId });
  } catch {
    toast("حدث خطأ ما", {
      action: {
        label: "حسناً",
        onClick: () => {},
      },
    });
  } finally {
    setIsSubmitting(false);
    closeRef.current?.click();
  }
};

export const cancelAppointment = async ({
  ...props
}: Omit<AppointmentActionProps, "emitEvent">) => {
  appointmentAction({
    emitEvent: "cancel appointment",
    ...props,
  });
};
