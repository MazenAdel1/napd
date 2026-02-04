import Form from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRef } from "react";

import { CalendarPlus, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { addMultipleSlots, addOneSlot } from "./utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  AddTimeSlotProps,
  MultipleSlotsSchema,
  OneSlotSchema,
} from "./types";
import {
  MULTIPLE_SLOTS_INPUTS,
  MULTIPLE_SLOTS_SCHEMA,
  ONE_SLOT_INPUTS,
  ONE_SLOT_SCHEMA,
} from "./consts";

export default function AddTimeSlot({ date, setSlots }: AddTimeSlotProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const addOneSlotForm = useForm<OneSlotSchema>({
    resolver: zodResolver(ONE_SLOT_SCHEMA),
  });

  const addMultipleSlotsForm = useForm<MultipleSlotsSchema>({
    resolver: zodResolver(MULTIPLE_SLOTS_SCHEMA),
  });

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-cyan-600 transition hover:bg-cyan-700">
            {" "}
            أضف موعد <CalendarPlus className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogClose className="hidden" ref={closeRef} />
          <Form
            form={addOneSlotForm}
            inputs={ONE_SLOT_INPUTS(date)}
            onSubmit={() =>
              addOneSlot({
                values: addOneSlotForm.getValues(),
                setSlots,
                closeRef,
                addOneSlotForm,
              })
            }
            submitText="أضف الموعد"
            className="bg-none shadow-none"
          />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-purple-600 transition hover:bg-purple-700">
            إضافة سريعة
            <Zap className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogClose className="hidden" ref={closeRef} />
          <Form
            form={addMultipleSlotsForm}
            inputs={MULTIPLE_SLOTS_INPUTS(date)}
            onSubmit={() =>
              addMultipleSlots({
                values: addMultipleSlotsForm.getValues(),
                setSlots,
                closeRef,
                addMultipleSlotsForm,
              })
            }
            submitText="أضف المواعيد"
            className="bg-none shadow-none"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
