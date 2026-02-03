import { cn, sortedTimeSlots, weekday } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Slot } from "@/types";
import ClientTimeSlotCard from "./ClientTimeSlotCard";
import { use, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarContext } from "@/components/ui/sidebar";

type Status = "choose_date" | "slots";

type Props = {
  date: Date;
  setStep: React.Dispatch<React.SetStateAction<Status>>;
};

export default function ClientTimeSlots({ setStep, date }: Props) {
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
      <div className="flex items-center justify-between">
        <Button onClick={() => setStep("choose_date")} variant={"outline"}>
          <ArrowRight className="size-4" />
          الرجوع
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl">
          المواعيد الحالية ليوم {weekday[date.getDay()]} {formattedDate}
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
              <ClientTimeSlotCard
                key={slot.id}
                slot={slot}
                setSlots={setSlots}
              />
            ))}
          </div>
        ) : (
          <div className="text-xl">لا توجد مواعيد لهذا اليوم.</div>
        )}
      </div>
    </section>
  );
}
