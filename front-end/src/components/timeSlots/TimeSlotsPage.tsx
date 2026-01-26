import { Calendar } from "@/components/ui/calendar";
import { ar } from "date-fns/locale";
import { use, useEffect, useState } from "react";
import TimeSlots from "./TimeSlots";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { UserContext } from "@/UserProvider";

export type Status = "choose_date" | "slots";

export default function TimeSlotsPage() {
  const [date, setDate] = useState<Date>();
  const [step, setStep] = useState<Status>("choose_date");
  const { user } = use(UserContext);

  useEffect(() => {
    if (date) {
      setStep("slots");
    }
  }, [date]);

  return (
    <>
      {step === "choose_date" && (
        <div className="container">
          {user?.role === "CLIENT" && (
            <Button asChild className="mb-2">
              <Link to="..">الرجوع</Link>
            </Button>
          )}
          <div className="mx-auto h-[95%] w-full md:w-3/4 lg:w-1/2">
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
      )}
      {step === "slots" && date && <TimeSlots date={date} setStep={setStep} />}
    </>
  );
}
