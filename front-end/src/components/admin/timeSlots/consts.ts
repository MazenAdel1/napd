import type { InputField } from "@/types";
import z from "zod";
import type { MultipleSlotsSchema, OneSlotSchema } from "./types";
import { format } from "date-fns";

export const ONE_SLOT_INPUTS = (date: Date): InputField<OneSlotSchema>[] => [
  {
    id: "startTime",
    label: "وقت البدء",
    name: "startTime",
    type: "time",
    placeholder: "ادخل وقت البدء",
  },
  {
    id: "endTime",
    label: "وقت الانتهاء",
    name: "endTime",
    type: "time",
    placeholder: "ادخل وقت الانتهاء",
  },
  {
    id: "date",
    name: "date",
    type: "text",
    defaultValue: format(date, "yyyy-MM-dd"),
    hidden: true,
  },
];

export const MULTIPLE_SLOTS_INPUTS = (
  date: Date,
): InputField<MultipleSlotsSchema>[] => [
  {
    id: "slotsStartTime",
    label: "وقت بداية الحجوزات",
    name: "slotsStartTime",
    type: "time",
    placeholder: "أدخل وقت بداية المواعيد",
  },
  {
    id: "slotsEndTime",
    label: "وقت انتهاء الحجوزات",
    name: "slotsEndTime",
    type: "time",
    placeholder: "أدخل وقت انتهاء المواعيد",
  },
  {
    id: "slotDuration",
    label: "مدة الموعد (بالدقائق)",
    name: "slotDuration",
    type: "number",
    placeholder: "أدخل وقت الموعد الواحد",
  },
  {
    id: "date",
    label: "date",
    name: "date",
    type: "text",
    defaultValue: format(date, "yyyy-MM-dd"),
    hidden: true,
  },
];

export const ONE_SLOT_SCHEMA = z.object({
  startTime: z.string(),
  endTime: z.string(),
  date: z.string(),
});

export const MULTIPLE_SLOTS_SCHEMA = z.object({
  slotsStartTime: z.string(),
  slotsEndTime: z.string(),
  slotDuration: z.number(),
  date: z.string(),
});

export const adminTimeSlotStatus = {
  AVAILABLE: {
    text: "متاح",
    styles: "text-blue-500 bg-blue-50 rounded-lg px-2 py-1",
  },
  BOOKED: {
    text: "محجوز",
    styles: "text-green-500 bg-green-50 rounded-lg px-2 py-1",
  },
};
