import { Calendar } from "@/components/ui/calendar";
import { ar } from "date-fns/locale";
import type { TimeSlotsCalendarProps } from "./types";

export default function TimeSlotsCalendar({
  date,
  setDate,
  header,
}: TimeSlotsCalendarProps) {
  return (
    <div>
      {header}
      <div className="mx-auto h-[95%] w-full sm:max-w-lg">
        <Calendar
          mode="single"
          className="size-full overflow-auto rounded-md shadow-md"
          required
          selected={date}
          onSelect={setDate}
          locale={ar}
          classNames={{
            today: "bg-gray-200 rounded-md",
          }}
        />
      </div>
    </div>
  );
}
