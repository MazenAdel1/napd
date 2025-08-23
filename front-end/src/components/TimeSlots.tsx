import AddTimeSlot from "./pages/admin/AddTimeSlot";
import {
  cn,
  getHoursMinutes,
  sortedTimeSlots,
  timeSlotStatus,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import type { Slot } from "@/types";
import axios from "axios";
import { format } from "date-fns";
import { ArrowLeft, LoaderCircle, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Status } from "./TimeSlotsPage";
import { UserContext } from "@/UserProvider";

type Props = {
  date: Date;
  setStep: React.Dispatch<React.SetStateAction<Status>>;
};

export default function TimeSlots({ setStep, date }: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(UserContext);

  const formattedDate = format(date, "yyyy-MM-dd");

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      if (date) {
        const { data }: { data: { timeSlots: Slot[] } } = (
          await axios.get(
            `http://localhost:3000/api/timeSlots/day/${formattedDate}`
          )
        ).data;

        setSlots(sortedTimeSlots(data.timeSlots));
      }

      setIsLoading(false);
    })();
  }, [date, formattedDate]);

  const deleteSlot = async (id: Slot["id"]) => {
    setIsSubmitting(true);

    await axios.delete(`http://localhost:3000/api/timeSlots`, {
      params: { id },
      withCredentials: true,
    });

    setSlots((prev) => prev.filter((slot) => slot.id !== id));
    setIsSubmitting(false);
  };

  const bookSlot = async (slotId: Slot["id"]) => {
    setIsSubmitting(true);
    await axios.post(
      `http://localhost:3000/api/timeSlots/book`,
      {},
      {
        params: { id: slotId },
        withCredentials: true,
      }
    );

    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          return { ...slot, status: "BOOKED" };
        }
        return slot;
      })
    );
    setIsSubmitting(false);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => setStep("choose_date")}>الرجوع</Button>
        {user?.role == "ADMIN" && date && (
          <AddTimeSlot date={date} setSlots={setSlots} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h1>المواعيد الحالية لـ{formattedDate}</h1>
        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="block h-14 w-full bg-gray-300" />
              ))
            : slots.length > 0 &&
              slots.map((slot) => (
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
                        <p className="text-center">
                          هل أنت متأكد من حذف هذا الموعد؟
                        </p>
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

                  <div className="flex items-center gap-1">
                    <div>{getHoursMinutes(slot.startTime)}</div>
                    <ArrowLeft />
                    <div>{getHoursMinutes(slot.endTime)}</div>
                  </div>
                  <div>
                    الحالة:{" "}
                    <span
                      data-client={user?.role == "CLIENT"}
                      className={cn(
                        "font-semibold",
                        timeSlotStatus[slot.status].styles
                      )}
                    >
                      {timeSlotStatus[slot.status].text}
                    </span>
                  </div>
                  {slot.status == "AVAILABLE" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>احجز</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <p className="text-center">
                          هل أنت متأكد من حجز هذا الموعد؟
                        </p>
                        <Button
                          onClick={() => bookSlot(slot.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <LoaderCircle className="animate-spin size-5" />
                          ) : (
                            "حجز"
                          )}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
