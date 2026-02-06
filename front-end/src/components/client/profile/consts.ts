import { REQUIRED_FIELD_MESSAGE } from "@/lib/consts";
import z from "zod";
import type { EditProfileFormSchema } from "./types";
import type { FormProps } from "@/types";

export const EDIT_PROFILE_SCHEMA = z.object({
  name: z
    .string("يجب أن يكون الاسم ثلاثي باللغة العربية")
    .regex(/^([\u0600-\u06FF]+\s){2}[\u0600-\u06FF]+$/, {
      error: "يجب أن يكون الاسم ثلاثي باللغة العربية",
    }),
  phoneNumber: z
    .string(REQUIRED_FIELD_MESSAGE)
    .regex(/^\d+$/, "يجب أن يحتوى رقم الهاتف على أرقام فقط")
    .length(11, { error: "رقم هاتف غير صحيح" }),
  age: z.number(REQUIRED_FIELD_MESSAGE),
  address: z.string(REQUIRED_FIELD_MESSAGE),
  hasPastOperations: z.boolean().default(false).nonoptional(),
  pastOperationsDesc: z.string().optional(),
  isTakingMedications: z.boolean().default(false).nonoptional(),
  medicationsDesc: z.string().optional(),
  healthStatus: z.string().optional(),
});

export const EDIT_PROFILE_INPUTS = (
  defaultValues?: Partial<EditProfileFormSchema>,
): FormProps<EditProfileFormSchema>["inputs"] => [
  {
    id: "name",
    label: "الاسم",
    name: "name",
    type: "text",
    placeholder: "أدخل اسمك ثلاثي",
    defaultValue: defaultValues?.name ?? "",
  },
  {
    id: "phoneNumber",
    label: "رقم الهاتف",
    name: "phoneNumber",
    type: "tel",
    placeholder: "أدخل رقم هاتفك",
    defaultValue: defaultValues?.phoneNumber ?? "",
  },
  {
    id: "age",
    label: "السن",
    name: "age",
    type: "number",
    placeholder: "أدخل سنك",
    defaultValue: defaultValues?.age?.toString() ?? "",
  },
  {
    id: "address",
    label: "العنوان",
    name: "address",
    type: "text",
    placeholder: "أدخل عنوانك",
    defaultValue: defaultValues?.address ?? "",
  },
  {
    id: "hasPastOperations",
    label: "هل لديك عمليات سابقة؟",
    name: "hasPastOperations",
    type: "checkbox",
    defaultChecked: defaultValues?.hasPastOperations ?? false,
  },
  {
    id: "pastOperationsDesc",
    label: "وصف عملياتك السابقة",
    name: "pastOperationsDesc",
    type: "textarea",
    placeholder: "وصف عملياتك السابقة",
    required: false,
    defaultValue: defaultValues?.pastOperationsDesc ?? "",
  },
  {
    id: "isTakingMedications",
    label: "هل تستخدم أدوية؟",
    name: "isTakingMedications",
    type: "checkbox",
    defaultChecked: defaultValues?.isTakingMedications ?? false,
  },
  {
    id: "medicationsDesc",
    label: "وصف الأدوية التي تستخدمها",
    name: "medicationsDesc",
    type: "textarea",
    placeholder: "وصف الأدوية التي تستخدمها",
    required: false,
    defaultValue: defaultValues?.medicationsDesc ?? "",
  },
  {
    id: "healthStatus",
    label: "الحالة الصحية",
    name: "healthStatus",
    type: "textarea",
    placeholder: "وصف الحالة الصحية (سكر - ضغط - ...)",
    required: false,
    defaultValue: defaultValues?.healthStatus ?? "",
  },
];
