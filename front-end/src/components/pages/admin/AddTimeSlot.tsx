import Form, { type FormProps } from "@/components/Form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sortedTimeSlots } from "@/lib/utils";
import type { Slot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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

  const INPUTS: FormProps["inputs"] = [
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
  ];

  const SCHEMA = z.object({
    startTime: z.string(),
    endTime: z.string(),
  });

  const form = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
  });

  const onSubmit = async (values) => {
    try {
      values.date = format(date, "yyyy-MM-dd");
      const { data } = (
        await axios.post("http://localhost:3000/api/timeSlots", values, {
          withCredentials: true,
        })
      ).data;
      setSlots((prev) => sortedTimeSlots([...prev, data.timeSlot]));
      closeRef.current?.click();
    } catch (error) {
      form.setError("root", error?.response.data);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>أضف موعد</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">إضافة موعد</DialogTitle>
        <DialogClose className="hidden" ref={closeRef} />
        <Form
          form={form}
          inputs={INPUTS}
          onSubmit={onSubmit}
          submitText="أضف الموعد"
          className="bg-[color:_none] shadow-none"
        />
      </DialogContent>
    </Dialog>
  );
}
