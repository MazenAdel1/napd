import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { io } from "socket.io-client";
import type { Slot } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const socketUrl =
  import.meta.env.VITE_BASE_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:3000";

export const socket = io(socketUrl, {
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
  const amOrPm = hoursIn24 > 12 ? "م" : "ص";

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${amOrPm}`;
};

export const timeSlotStatus = {
  AVAILABLE: {
    text: "متاح",
    styles: {
      CLIENT: "text-green-500 bg-green-50 rounded-lg px-2 py-1",
      ADMIN: "text-blue-500 bg-blue-50 rounded-lg px-2 py-1",
    },
  },
  BOOKED: {
    text: "محجوز",
    styles: {
      CLIENT: "text-red-500 bg-red-50 rounded-lg px-2 py-1",
      ADMIN: "text-green-500 bg-green-50 rounded-lg px-2 py-1",
    },
  },
};

export const sortedTimeSlots = (slots: Slot[]) => {
  return slots.sort(
    (a, b) =>
      (new Date(a.startTime) as unknown as number) -
      (new Date(b.startTime) as unknown as number),
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
