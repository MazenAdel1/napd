import { cn, sortedTimeSlots } from "@/lib/utils";
import React, { use, useEffect, useState } from "react";
import type { Slot } from "@/components/shared/timeSlots";
import axios from "@/lib/axios";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarContext } from "@/components/ui/sidebar";
import type { TimeSlotsListProps } from "./types";
import { weekdays } from "@/lib/consts";

export default function TimeSlotsList({
  date,
  header,
  renderSlot,
}: TimeSlotsListProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = format(date, "dd-MM-yyyy");
  const sidebarContext = use(SidebarContext);

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
      {header}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl">
          المواعيد الحالية ليوم {weekdays[date.getDay()]} {formattedDate}
        </h1>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="block h-30 w-full bg-gray-300" />
            ))}
          </div>
        ) : slots.length > 0 ? (
          <div
            className={cn(
              "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              sidebarContext &&
                sidebarContext.open &&
                "lg:grid-cols-2 xl:grid-cols-3",
            )}
          >
            {slots.map((slot) => (
              <React.Fragment key={slot.id}>
                {renderSlot(slot, setSlots)}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-xl">لا توجد مواعيد لهذا اليوم.</div>
        )}
      </div>
    </section>
  );
}
