import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Slot } from "@/components/shared/timeSlots";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getHoursMinutes = (ISOTime: string) => {
  const time = new Date(ISOTime);
  const hoursIn24 = time.getHours();
  const minutes = time.getMinutes();

  const hours =
    hoursIn24 == 0 ? 12 : hoursIn24 > 12 ? hoursIn24 - 12 : hoursIn24;
  const amOrPm = hoursIn24 > 12 ? "م" : "ص";

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${amOrPm}`;
};

export const sortedTimeSlots = (slots: Slot[]) => {
  return slots.sort(
    (a, b) =>
      (new Date(a.startTime) as unknown as number) -
      (new Date(b.startTime) as unknown as number),
  );
};
