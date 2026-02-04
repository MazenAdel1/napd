import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import {
  AppointmentCardBase,
  cancelAppointment,
  type AppointmentCardProps,
} from "@/components/shared/appointments";

export default function ClientAppointmentCard({
  appointment,
}: AppointmentCardProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <AppointmentCardBase
      appointment={appointment}
      actions={
        appointment.status === "PENDING" ? (
          <div className="mt-3 flex w-full items-center gap-1 *:flex-1">
            {/* Cancel Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"outline"}
                  className="border-red-600 bg-red-600/5 text-red-600 hover:bg-red-600/10 hover:text-red-600"
                >
                  إلغاء الحجز
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogClose className="sr-only" ref={closeRef} />
                <p className="text-center">هل أنت متأكد من إلغاء هذا الحجز؟</p>
                <Button
                  variant={"destructive"}
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={() =>
                    cancelAppointment({
                      appointmentId: appointment.id,
                      setIsSubmitting,
                      closeRef,
                    })
                  }
                >
                  {isSubmitting ? (
                    <LoaderCircle className="size-5 animate-spin" />
                  ) : (
                    "إلغاء الحجز"
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        ) : undefined
      }
    />
  );
}
