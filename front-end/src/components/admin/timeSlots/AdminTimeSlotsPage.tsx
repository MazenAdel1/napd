import { useEffect, useState } from "react";
import { TimeSlotsCalendar, type Status } from "@/components/shared/timeSlots";
import AdminTimeSlots from "./AdminTimeSlots";

export default function AdminTimeSlotsPage() {
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
        <TimeSlotsCalendar date={date} setDate={setDate} />
      )}
      {step === "slots" && date && (
        <AdminTimeSlots date={date} setStep={setStep} />
      )}
    </>
  );
}
