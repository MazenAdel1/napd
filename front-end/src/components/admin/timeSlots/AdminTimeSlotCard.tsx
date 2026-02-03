import type { Slot } from "@/types";
import { useState } from "react";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { TimeSlotCardBase } from "@/components/shared/timeSlots";
import ActionsMenu from "@/components/shared/ActionsMenu";

type Props = {
  slot: Slot;
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
};

const timeSlotStatusAdmin = {
  AVAILABLE: {
    text: "متاح",
    styles: "text-blue-500 bg-blue-50 rounded-lg px-2 py-1",
  },
  BOOKED: {
    text: "محجوز",
    styles: "text-green-500 bg-green-50 rounded-lg px-2 py-1",
  },
};

export default function AdminTimeSlotCard({ slot, setSlots }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteSlot = async (id: Slot["id"]) => {
    setIsSubmitting(true);

    await axios.delete(`/timeSlots`, {
      params: { id },
    });

    setSlots((prev) => prev.filter((s) => s.id !== id));
    setIsSubmitting(false);
  };

  const isSlotTimeout = new Date(slot.startTime) < new Date();

  return (
    <TimeSlotCardBase
      slot={slot}
      actions={
        <ActionsMenu
          deleteAction={() => deleteSlot(slot.id)}
          isDeleting={isSubmitting}
          triggerClassName="mr-auto"
        />
      }
      statusBadge={
        <div>
          {!isSlotTimeout && slot.status === "AVAILABLE" && (
            <span
              className={cn(
                "font-semibold",
                timeSlotStatusAdmin[slot.status].styles,
              )}
            >
              {timeSlotStatusAdmin[slot.status].text}
            </span>
          )}
          {slot.status === "BOOKED" && (
            <span
              className={cn("font-semibold", timeSlotStatusAdmin.BOOKED.styles)}
            >
              {timeSlotStatusAdmin.BOOKED.text}
            </span>
          )}
        </div>
      }
    />
  );
}
