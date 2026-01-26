import AddTimeSlot from "../pages/admin/AddTimeSlot";
import { sortedTimeSlots, weekday } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import type { Slot } from "@/types";
import axios from "@/lib/axios";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import type { Status } from "./TimeSlotsPage";
import { UserContext } from "@/UserProvider";
import TimeSlotCard from "./TimeSlotCard";

type Props = {
  date: Date;
  setStep: React.Dispatch<React.SetStateAction<Status>>;
};

export default function TimeSlots({ setStep, date }: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(UserContext);
  const formattedDate = format(date, "dd-MM-yyyy");

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      if (date) {
        const { timeSlots } = (
          await axios.get(`/timeSlots/day/${format(date, "yyyy-MM-dd")}`)
        ).data.data;

        setSlots(sortedTimeSlots(timeSlots));
      }

      setIsLoading(false);
    })();
  }, [date]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button onClick={() => setStep("choose_date")}>الرجوع</Button>
        {user?.role == "ADMIN" && date && (
          <AddTimeSlot date={date} setSlots={setSlots} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl">
          المواعيد الحالية ليوم {weekday[date.getDay()]} {formattedDate}
        </h1>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="block h-14 w-full bg-gray-300" />
            ))}
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {slots.map((slot) => (
              <TimeSlotCard key={slot.id} slot={slot} setSlots={setSlots} />
            ))}
          </div>
        ) : (
          <div className="text-xl">لا توجد مواعيد لهذا اليوم.</div>
        )}
      </div>
    </section>
  );
}
