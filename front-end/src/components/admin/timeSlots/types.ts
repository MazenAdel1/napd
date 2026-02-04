import type z from "zod";
import type { MULTIPLE_SLOTS_SCHEMA, ONE_SLOT_SCHEMA } from "./consts";
import type { Slot } from "@/components/shared/timeSlots/types";
import type { useForm } from "react-hook-form";

export type OneSlotSchema = z.infer<typeof ONE_SLOT_SCHEMA>;
export type MultipleSlotsSchema = z.infer<typeof MULTIPLE_SLOTS_SCHEMA>;
export type AddSlotProps = {
  values: OneSlotSchema | MultipleSlotsSchema;
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  addOneSlotForm?: ReturnType<typeof useForm<OneSlotSchema>>;
  addMultipleSlotsForm?: ReturnType<typeof useForm<MultipleSlotsSchema>>;
};

export type AddTimeSlotProps = {
  date: Date;
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
};
