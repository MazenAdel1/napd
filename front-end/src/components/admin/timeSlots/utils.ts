import { sortedTimeSlots } from "@/lib/utils";
import axios from "@/lib/axios";
import axs from "axios";
import type { AddSlotProps } from "./types";

export const addOneSlot = async ({
  values,
  setSlots,
  closeRef,
  addOneSlotForm,
}: AddSlotProps) => {
  try {
    const { timeSlot } = (await axios.post("/timeSlots", values)).data.data;
    setSlots((prev) => sortedTimeSlots([...prev, timeSlot]));
    closeRef.current?.click();
  } catch (error) {
    addOneSlotForm?.setError(
      "root",
      axs.isAxiosError(error) ? error.response?.data : "حدث خطأ ما",
    );
  }
};

export const addMultipleSlots = async ({
  values,
  setSlots,
  closeRef,
  addMultipleSlotsForm,
}: AddSlotProps) => {
  try {
    const { timeSlots } = (await axios.post("/timeSlots/multiple", values)).data
      .data;
    setSlots((prev) => sortedTimeSlots([...prev, ...timeSlots]));
    closeRef.current?.click();
  } catch (error) {
    addMultipleSlotsForm?.setError(
      "root",
      axs.isAxiosError(error) ? error.response?.data : "حدث خطأ ما",
    );
  }
};
