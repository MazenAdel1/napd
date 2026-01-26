import React from "react";
import type { Path, UseFormReturn } from "react-hook-form";
import type { ClassNameValue } from "tailwind-merge";

type InputType = HTMLInputElement["type"];

export type InputField<T extends Record<string, unknown>> = {
  id: string;
  name: Path<T>;
  label?: string;
  type: InputType;
  placeholder?: string;
  editable?: boolean;
  required?: boolean;
  className?: ClassNameValue;
  defaultValue?: HTMLInputElement["defaultValue"];
  hidden?: boolean;
};

export type FormProps<T extends Record<string, unknown>> = {
  form: UseFormReturn<T>;
  inputs: InputField<T>[];
  onSubmit: (values: T, form: UseFormReturn<T>) => void;
  submitText: string;
  className?: ClassNameValue;
  additionalContent?: React.ReactNode;
};

export type DataWrapper = {
  limit?: number;
  seeAllButton?: boolean;
};

export type User = {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  age: number;
  role: "CLIENT" | "ADMIN";
  hasPastOperations: boolean;
  pastOperationsDesc: string;
  isTakingMedications: boolean;
  medicationsDesc: string;
  healthStatus: string;
};

export type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
  appointment: Appointment;
};

export type Appointment = {
  id: string;
  user: User;
  userId: User["id"];
  timeSlot: Slot;
  timeSlotId: Slot["id"];
  status: "PENDING" | "CONFIRMED";
  report: Report;
};

export type Report = {
  id: string;
  appointment: Appointment;
  appointmentId: Appointment["id"];
  description: string;
};

export type ReportForm<T extends Record<string, unknown>> = {
  className?: ClassNameValue;
} & (
  | {
      status: "CREATE";
      appointmentId: Appointment["id"];
    }
  | {
      status: "UPDATE";
      reportId: Report["id"];
      setReport: React.Dispatch<React.SetStateAction<Partial<Report> | null>>;
      defaultValue?: InputField<T>["defaultValue"];
      closeRef?: React.RefObject<HTMLButtonElement | null>;
    }
);
