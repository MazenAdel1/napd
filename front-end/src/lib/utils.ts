import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { io } from "socket.io-client";
import type { Slot } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const socket = io("https://abo-greda-production.up.railway.app", {
  withCredentials: true,
  transports: ["websocket", "polling"],
  upgrade: true,
  timeout: 20000,
  forceNew: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const getHoursMinutes = (ISOTime: string) => {
  const time = new Date(ISOTime);
  const hoursIn24 = time.getHours();
  const minutes = time.getMinutes();

  const hours =
    hoursIn24 == 0 ? 12 : hoursIn24 > 12 ? hoursIn24 - 12 : hoursIn24;
  const amOrPm = hoursIn24 > 12 ? "مساء" : "صباحا";

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${amOrPm}`;
};

export const timeSlotStatus = {
  AVAILABLE: {
    text: "متاح",
    styles: {
      CLIENT: "text-green-500",
      ADMIN: "text-blue-500",
    },
  },
  BOOKED: {
    text: "محجوز",
    styles: {
      CLIENT: "text-red-500",
      ADMIN: "text-green-500",
    },
  },
};

export const sortedTimeSlots = (slots: Slot[]) => {
  return slots.sort(
    (a, b) =>
      (new Date(a.startTime) as unknown as number) -
      (new Date(b.startTime) as unknown as number)
  );
};

export const weekday = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export const REQUIRED_FIELD_MESSAGE = "الرجاء إدخال البيانات المطلوبة";
