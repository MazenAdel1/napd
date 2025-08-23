import { Calendar } from "@/components/ui/calendar";
import { ar } from "date-fns/locale";
import { useEffect, useState } from "react";
import TimeSlots from "./TimeSlots";

export type Status = "choose_date" | "slots";

export default function TimeSlotsPage() {
  const [date, setDate] = useState<Date>();
  const [step, setStep] = useState<Status>("choose_date");

  useEffect(() => {
    if (date) {
      setStep("slots");
    }
  }, [date]);

  return (
    <>
      {step === "choose_date" && (
        <Calendar
          mode="single"
          className="shadow-md rounded-md w-1/2 h-[95%] overflow-auto mx-auto"
          required
          selected={date}
          onSelect={setDate}
          locale={ar}
        />
      )}
      {step === "slots" && date && <TimeSlots date={date} setStep={setStep} />}
    </>
  );
}
