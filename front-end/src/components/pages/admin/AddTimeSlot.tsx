import Form from "@/components/Form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sortedTimeSlots } from "@/lib/utils";
import type { FormProps, Slot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/lib/axios";
import axs from "axios";
import { format } from "date-fns";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  date: Date;
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
};

export default function TimeSlotForm({ date, setSlots }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const ONE_SLOT_SCHEMA = z.object({
    startTime: z.string(),
    endTime: z.string(),
    date: z.string(),
  });

  const MULTIPLE_SLOTS_SCHEMA = z.object({
    slotsStartTime: z.string(),
    slotsEndTime: z.string(),
    slotDuration: z.number(),
    date: z.string(),
  });

  type OneSlotSchema = z.infer<typeof ONE_SLOT_SCHEMA>;
  type MultipleSlotsSchema = z.infer<typeof MULTIPLE_SLOTS_SCHEMA>;

  const ONE_SLOT_INPUTS: FormProps<OneSlotSchema>["inputs"] = [
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

  const MULTIPLE_SLOTS_INPUTS: FormProps<MultipleSlotsSchema>["inputs"] = [
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
      label: "مدة الموعد",
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

  const addOneSlotForm = useForm<OneSlotSchema>({
    resolver: zodResolver(ONE_SLOT_SCHEMA),
  });

  const addMultipleSlotsForm = useForm<MultipleSlotsSchema>({
    resolver: zodResolver(MULTIPLE_SLOTS_SCHEMA),
  });

  const addOneSlot: FormProps<OneSlotSchema>["onSubmit"] = async (values) => {
    try {
      const { timeSlot } = (await axios.post("/timeSlots", values)).data.data;
      setSlots((prev) => sortedTimeSlots([...prev, timeSlot]));
      closeRef.current?.click();
    } catch (error) {
      addOneSlotForm.setError(
        "root",
        axs.isAxiosError(error) ? error.response?.data : "حدث خطأ ما"
      );
    }
  };

  const addMultipleSlots: FormProps<MultipleSlotsSchema>["onSubmit"] = async (
    values
  ) => {
    try {
      const { timeSlots } = (await axios.post("/timeSlots/multiple", values))
        .data.data;
      setSlots((prev) => sortedTimeSlots([...prev, ...timeSlots]));
      closeRef.current?.click();
    } catch (error) {
      addMultipleSlotsForm.setError(
        "root",
        axs.isAxiosError(error) ? error.response?.data : "حدث خطأ ما"
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>أضف موعد</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogClose className="hidden" ref={closeRef} />
          <Form
            form={addOneSlotForm}
            inputs={ONE_SLOT_INPUTS}
            onSubmit={addOneSlot}
            submitText="أضف الموعد"
            className="bg-inherit shadow-none"
          />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button>إضافة سريعة</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogClose className="hidden" ref={closeRef} />
          <Form
            form={addMultipleSlotsForm}
            inputs={MULTIPLE_SLOTS_INPUTS}
            onSubmit={addMultipleSlots}
            submitText="أضف المواعيد"
            className="bg-inherit shadow-none"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
