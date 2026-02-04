import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { socket } from "@/lib/consts";
import { Link } from "react-router";
import { use, useRef, useState } from "react";
import axios from "@/lib/axios";
import axs from "axios";
import { toast } from "sonner";
import { UserContext } from "@/UserProvider";
import {
  isSlotTimeout,
  TimeSlotCardBase,
  type Slot,
  type TimeSlotCardProps,
} from "@/components/shared/timeSlots";

const timeSlotStatusClient = {
  AVAILABLE: {
    text: "متاح",
    styles: "text-green-500 bg-green-50 rounded-lg px-2 py-1",
  },
  BOOKED: {
    text: "محجوز",
    styles: "text-red-500 bg-red-50 rounded-lg px-2 py-1",
  },
};

export default function ClientTimeSlotCard({
  slot,
  setSlots,
}: TimeSlotCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { user } = use(UserContext);

  const bookSlot = async (slotId: Slot["id"]) => {
    try {
      setIsSubmitting(true);
      const { timeSlot } = (
        await axios.post(
          `/timeSlots/book`,
          {},
          {
            params: { id: slotId },
          },
        )
      ).data.data;

      socket.emit("add appointment", { slotId });

      setSlots((prev) =>
        prev.map((s) => {
          if (s.id === slotId) {
            return timeSlot;
          }
          return s;
        }),
      );
    } catch (error) {
      toast(
        axs.isAxiosError(error) ? error.response?.data.message : "حدث خطأ ما",
        {
          action: {
            label: "حسناً",
            onClick: () => {},
          },
        },
      );
      closeRef.current?.click();
    } finally {
      setIsSubmitting(false);
    }
  };

  const slotTimeout = isSlotTimeout(slot.startTime);
  const isBookedByMe = slot.appointment?.userId === user?.id;

  return (
    <TimeSlotCardBase
      slot={slot}
      statusBadge={
        <div className="mt-auto">
          <span
            className={cn(
              "font-semibold",
              timeSlotStatusClient[slot.status].styles,
              isBookedByMe &&
                slot.appointment?.status === "CONFIRMED" &&
                "bg-blue-50 text-blue-500",
              isBookedByMe &&
                slot.appointment?.status === "PENDING" &&
                "bg-yellow-50 text-yellow-500",
            )}
          >
            {timeSlotStatusClient[slot.status].text}
            {isBookedByMe && slot.appointment?.status === "CONFIRMED" && " لك"}
            {isBookedByMe &&
              slot.appointment?.status === "PENDING" &&
              " (قيد الانتظار)"}
          </span>

          {isBookedByMe ? (
            <Button asChild className="mt-2 w-full" variant={"secondary"}>
              <Link to={"/appointments"}>الذهاب لحجوزاتي</Link>
            </Button>
          ) : (
            slot.status === "BOOKED" && (
              <span className="mt-2 block rounded-lg bg-red-100 py-1 text-center text-red-500">
                الموعد محجوز
              </span>
            )
          )}
        </div>
      }
      footer={
        slot.status === "AVAILABLE" && !slotTimeout ? (
          <Dialog>
            <DialogTrigger asChild className="mt-auto h-8">
              <Button className="w-full bg-linear-to-r from-green-500 to-emerald-500 transition-all hover:from-green-600 hover:to-emerald-600 hover:shadow-md">
                احجز الآن
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogClose className="sr-only" ref={closeRef} />
              <p className="text-center">هل أنت متأكد من حجز هذا الموعد؟</p>
              <Button
                className="w-full bg-linear-to-r from-green-500 to-emerald-500 transition-all hover:from-green-600 hover:to-emerald-600 hover:shadow-md"
                onClick={() => bookSlot(slot.id)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="size-5 animate-spin" />
                ) : (
                  "حجز"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        ) : undefined
      }
    />
  );
}
