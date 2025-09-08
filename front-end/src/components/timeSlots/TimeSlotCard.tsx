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
          }
        )
      ).data.data;

      socket.emit("add appointment", { slotId });

      setSlots((prev) =>
        prev.map((slot) => {
          if (slot.id === slotId) {
            return timeSlot;
          }
          return slot;
        })
      );
    } catch (error) {
      toast(
        axs.isAxiosError(error) ? error.response?.data.message : "حدث خطأ ما",
        {
          action: {
            label: "حسناً",
            onClick: () => {},
          },
        }
      );
      closeRef.current?.click();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      key={slot.id}
      className="text-black bg-white shadow border-2 border-t-green-400 flex flex-col w-fit p-2 rounded-md gap-2 group relative"
    >
      {user?.role == "ADMIN" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="absolute top-1/2 -translate-y-1/2 left-2 group-hover:opacity-100 opacity-0 transition"
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
                <LoaderCircle className="animate-spin size-5" />
              ) : (
                "حذف"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex items-center gap-1 sm:text-base text-sm">
        <div>{getHoursMinutes(slot.startTime)}</div>
        <ArrowLeft />
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

              slot.appointment?.userId == user?.id && "text-blue-500"
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
            <DialogTrigger asChild>
              <Button>احجز</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogClose className="sr-only" ref={closeRef} />
              <p className="text-center">هل أنت متأكد من حجز هذا الموعد؟</p>
              <Button onClick={() => bookSlot(slot.id)} disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin size-5" />
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
