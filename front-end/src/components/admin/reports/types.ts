import type z from "zod";
import type { REPORT_SCHEMA } from "./consts";
import type { Appointment } from "@/components/shared/appointments";
import type { ClassNameValue } from "tailwind-merge";
import type { InputField } from "@/types";

export type ReportFormSchema = z.infer<typeof REPORT_SCHEMA>;

export type Report = {
  id: string;
  appointment: Appointment;
  appointmentId: Appointment["id"];
  description: string;
};

export type ReportFormType<T extends Record<string, unknown>> = {
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
