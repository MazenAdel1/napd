import { Calendar } from "@/components/ui/calendar";
import { ar } from "date-fns/locale";
import { useEffect, useState } from "react";
import TimeSlots from "./TimeSlots";
import { Button } from "../ui/button";
import { Link } from "react-router";

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
        <div className="container">
          <Button asChild className="mb-2">
            <Link to="..">الرجوع</Link>
          </Button>
          <div className="md:w-3/4 lg:w-1/2 w-full h-[95%] mx-auto">
            <Calendar
              mode="single"
              className="shadow-md rounded-md overflow-auto size-full"
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
      )}
      {step === "slots" && date && <TimeSlots date={date} setStep={setStep} />}
    </>
  );
}
