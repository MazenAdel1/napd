import { useState } from "react";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  TimeSlotCardBase,
  type Slot,
  type TimeSlotCardProps,
} from "@/components/shared/timeSlots";
import ActionsMenu from "@/components/shared/ActionsMenu";
import { adminTimeSlotStatus } from "./consts";

export default function AdminTimeSlotCard({
  slot,
  setSlots,
}: TimeSlotCardProps) {
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
                adminTimeSlotStatus[slot.status].styles,
              )}
            >
              {adminTimeSlotStatus[slot.status].text}
            </span>
          )}
          {slot.status === "BOOKED" && (
            <span
              className={cn("font-semibold", adminTimeSlotStatus.BOOKED.styles)}
            >
              {adminTimeSlotStatus.BOOKED.text}
            </span>
          )}
        </div>
      }
    />
  );
}
