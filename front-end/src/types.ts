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
  defaultChecked?: boolean;
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
