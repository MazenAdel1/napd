import type z from "zod";
import type { REPORT_SCHEMA } from "./consts";

export type ReportFormSchema = z.infer<typeof REPORT_SCHEMA>;
