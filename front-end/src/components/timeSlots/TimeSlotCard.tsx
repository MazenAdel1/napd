import type { Slot } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ArrowLeft, LoaderCircle, Trash } from "lucide-react";
import { cn, getHoursMinutes, socket, timeSlotStatus } from "@/lib/utils";
import { Link } from "react-router";
import React, { useContext, useRef, useState } from "react";
import axios from "@/lib/axios";
import axs from "axios";
import { toast } from "sonner";
import { UserContext } from "@/UserProvider";

type Props = {
  slot: Slot;
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
};

export default function TimeSlotCard({ slot, setSlots }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const { user } = useContext(UserContext);

  const deleteSlot = async (id: Slot["id"]) => {
    setIsSubmitting(true);

    await axios.delete(`/timeSlots`, {
      params: { id },
    });

    setSlots((prev) => prev.filter((slot) => slot.id !== id));
    setIsSubmitting(false);
  };

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
        prev.map((slot) => {
          if (slot.id === slotId) {
            return timeSlot;
          }
          return slot;
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

  return (
    <div
      key={slot.id}
      className="group relative flex flex-col gap-2 rounded-md border-2 border-t-green-400 bg-white p-2 text-black shadow"
    >
      {user?.role == "ADMIN" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="absolute top-1/2 left-2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100"
              variant={"destructive"}
            >
              <Trash />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <p className="text-center">هل أنت متأكد من حذف هذا الموعد؟</p>
            <Button
              variant={"destructive"}
              onClick={() => deleteSlot(slot.id)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                "حذف"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex items-center gap-1 text-sm font-semibold sm:text-base">
        <div>{getHoursMinutes(slot.startTime)}</div>
        <ArrowLeft className="size-4.5" />
        <div>{getHoursMinutes(slot.endTime)}</div>
      </div>
      <div>
        <div>
          الحالة:{" "}
          <span
            className={cn(
              "font-semibold",
              timeSlotStatus[slot.status].styles[
                user?.role as keyof typeof user
              ],

              slot.appointment?.userId == user?.id && "text-blue-500",
            )}
          >
            {timeSlotStatus[slot.status].text}{" "}
            {slot.appointment?.userId == user?.id && "لك"}
          </span>
          {slot.appointment?.userId == user?.id && (
            <Button asChild className="mt-2 w-full" variant={"secondary"}>
              <Link to={"/appointments"}>الذهاب لحجوزاتي</Link>
            </Button>
          )}
        </div>
      </div>
      {user?.role == "CLIENT" &&
        slot.status == "AVAILABLE" &&
        (new Date(slot.startTime) > new Date() ? (
          <Dialog>
            <DialogTrigger asChild className="mt-auto h-8">
              <Button>احجز</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogClose className="sr-only" ref={closeRef} />
              <p className="text-center">هل أنت متأكد من حجز هذا الموعد؟</p>
              <Button onClick={() => bookSlot(slot.id)} disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="size-5 animate-spin" />
                ) : (
                  "حجز"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        ) : (
          <span className="text-red-500">انقضى وقت هذا الموعد</span>
        ))}
    </div>
  );
}
