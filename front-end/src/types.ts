import type { ClassNameValue } from "tailwind-merge";

type InputType = HTMLInputElement["type"];

export type InputField = {
  id: string;
  name: string;
  label?: string;
  type: InputType;
  placeholder?: string;
  editable?: boolean;
  required?: boolean;
  className?: ClassNameValue;
  defaultValue?: string | number | boolean;
};

export type Client = {
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
};

export type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
};
