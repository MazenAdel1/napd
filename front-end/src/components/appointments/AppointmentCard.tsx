import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getHoursMinutes, socket, weekday } from "@/lib/utils";
import type { Appointment } from "@/types";
import { UserContext } from "@/UserProvider";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  LoaderCircle,
} from "lucide-react";
import { use, useRef, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import ReportForm from "@/components/pages/admin/report/ReportForm";

type Props = {
  appointment: Appointment;
};

export default function AppointmentCard({ appointment }: Props) {
  const { user } = use(UserContext);

  const closeRef = useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedDate = format(appointment.timeSlot.date, "dd-MM-yyyy");
  const day = weekday[new Date(appointment.timeSlot.date).getDay()];

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
        <h3 className="mb-2 text-lg">{appointment.user.phoneNumber}</h3>
        <p>
          يوم {day} {formattedDate}
        </p>
        <div className="flex items-center gap-1">
          <div>{getHoursMinutes(appointment.timeSlot.startTime)}</div>
          <ArrowLeft />
          <div>{getHoursMinutes(appointment.timeSlot.endTime)}</div>
        </div>
      </div>

      {appointment.status === "PENDING" && (
        <div className="mt-3 flex w-full items-center gap-1 *:flex-1">
          {user?.role === "ADMIN" && (
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
          )}

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
          {user?.role === "ADMIN" &&
            (appointment.report ? (
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
                    className={"bg-inherit shadow-none"}
                  />
                </DialogContent>
              </Dialog>
            ))}
        </div>
      )}
    </div>
  );
}
