import { useEffect, useState } from "react";
import { TimeSlotsCalendar } from "@/components/shared/timeSlots";
import ClientTimeSlots from "./ClientTimeSlots";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export type Status = "choose_date" | "slots";

export default function ClientTimeSlotsPage() {
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
        <TimeSlotsCalendar
          date={date}
          setDate={setDate}
          header={
            <Button asChild className="mb-2" variant={"outline"}>
              <Link to="..">
                <ArrowRight className="size-4" /> الرجوع
              </Link>
            </Button>
          }
        />
      )}
      {step === "slots" && date && (
        <ClientTimeSlots date={date} setStep={setStep} />
      )}
    </>
  );
}
