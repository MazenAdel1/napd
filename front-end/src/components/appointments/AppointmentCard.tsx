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
import { ArrowLeft, LoaderCircle } from "lucide-react";
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
      className="p-4 border rounded-md shadow relative group"
    >
      <h2 className="text-xl font-semibold">{appointment.user.name}</h2>
      <h3 className="text-lg mb-2">{appointment.user.phoneNumber}</h3>
      <p>
        يوم {day} {formattedDate}
      </p>
      <div className="flex items-center gap-1">
        <div>{getHoursMinutes(appointment.timeSlot.startTime)}</div>
        <ArrowLeft />
        <div>{getHoursMinutes(appointment.timeSlot.endTime)}</div>
      </div>
      {user?.role === "ADMIN" && appointment.status === "PENDING" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mt-3">تأكيد الحجز</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogClose className="sr-only" ref={closeRef} />
            <p className="text-center">هل ترغب في تأكيد الحجز؟</p>
            <Button
              variant={"default"}
              onClick={confirmAppointment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin size-5" />
              ) : (
                "تأكيد"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {appointment.status === "PENDING" && (
        <>
          <Badge
            variant={"default"}
            className="text-base absolute top-2 left-2 group-hover:opacity-30 transition group-focus-within:opacity-30"
          >
            في انتظار تأكيد الحجز
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"} className="w-full mt-2">
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
                  <LoaderCircle className="animate-spin size-5" />
                ) : (
                  "إلغاء الحجز"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        </>
      )}

      {appointment.status === "CONFIRMED" && (
        <>
          <Badge
            variant={"success"}
            className="text-base absolute top-2 left-2"
          >
            تم تأكيد الحجز
          </Badge>
          {user?.role === "ADMIN" &&
            (appointment.report ? (
              <Badge
                variant={"primary"}
                className="text-base absolute bottom-2 left-2"
                asChild
              >
                <Link to={`/admin/reports/${appointment.report.id}`}>
                  عرض التقرير
                </Link>
              </Badge>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"outline"} className="w-full mt-3">
                    كتابة تقرير
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
        </>
      )}
    </div>
  );
}
