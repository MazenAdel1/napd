import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { socket } from "@/lib/utils";
import type { Appointment } from "@/types";
import { Edit, Eye, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { AppointmentCardBase } from "@/components/shared/appointments";
import ReportForm from "@/components/admin/reports/ReportForm";

type Props = {
  appointment: Appointment;
};

export default function AdminAppointmentCard({ appointment }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmAppointment = async () => {
    try {
      setIsSubmitting(true);
      socket.emit("confirm appointment", { appointmentId: appointment.id });
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

  const cancelAppointment = async () => {
    try {
      setIsSubmitting(true);
      socket.emit("cancel appointment", { appointmentId: appointment.id });
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

  return (
    <AppointmentCardBase
      appointment={appointment}
      actions={
        <>
          {appointment.status === "PENDING" && (
            <div className="mt-3 flex w-full items-center gap-1 *:flex-1">
              {/* Confirm Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"success"}>تأكيد الحجز</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogClose className="sr-only" ref={closeRef} />
                  <p className="text-center">هل ترغب في تأكيد الحجز؟</p>
                  <Button
                    variant={"success"}
                    onClick={confirmAppointment}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="size-5 animate-spin" />
                    ) : (
                      "تأكيد"
                    )}
                  </Button>
                </DialogContent>
              </Dialog>

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
                  <p className="text-center">
                    هل أنت متأكد من إلغاء هذا الحجز؟
                  </p>
                  <Button
                    variant={"destructive"}
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={cancelAppointment}
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
          )}

          {appointment.status === "CONFIRMED" && (
            <div className="mt-auto w-full *:w-full">
              {appointment.report ? (
                <Button variant={"default"} asChild>
                  <Link to={`/admin/reports/${appointment.report.id}`}>
                    <Eye />
                    عرض التقرير
                  </Link>
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"outline"}>
                      <Edit /> كتابة تقرير
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ReportForm
                      status="CREATE"
                      appointmentId={appointment.id}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </>
      }
    />
  );
}
