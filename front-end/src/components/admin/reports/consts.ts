import type { FormProps } from "@/types";
import z from "zod";
import type { ReportFormSchema } from "./types";

export const REPORT_SCHEMA = z.object({
  description: z.string("نص التقرير مطلوب"),
});

export const REPORT_INPUTS = (
  defaultValue: string | undefined,
): FormProps<ReportFormSchema>["inputs"] => [
  {
    id: "description",
    label: "نص التقرير",
    name: "description",
    type: "textarea",
    placeholder: "اكتب نص التقرير هنا",
    defaultValue,
  },
];
