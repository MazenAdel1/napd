import { REQUIRED_FIELD_MESSAGE } from "@/lib/consts";
import type { FormProps } from "@/types";
import z from "zod";
import type { LoginFormSchema, RegisterFormSchema } from "./types";

// register
export const REGISTER_SCHEMA = z.object({
  name: z
    .string("يجب أن يكون الاسم ثلاثي باللغة العربية")
    .regex(/^([\u0600-\u06FF]+\s){2}[\u0600-\u06FF]+$/, {
      error: "يجب أن يكون الاسم ثلاثي باللغة العربية",
    }),
  phoneNumber: z
    .string(REQUIRED_FIELD_MESSAGE)
    .regex(/^\d+$/, "يجب أن يحتوى رقم الهاتف على أرقام فقط")
    .length(11, { error: "رقم هاتف غير صحيح" }),
  password: z
    .string(REQUIRED_FIELD_MESSAGE)
    .min(6, { error: "كلمة المرور يجب ان تكون على الاقل 6 حروف" }),
  age: z.number(REQUIRED_FIELD_MESSAGE),
  address: z.string(REQUIRED_FIELD_MESSAGE),
  hasPastOperations: z.boolean().default(false).nonoptional(),
  pastOperationsDesc: z.string().optional(),
  isTakingMedications: z.boolean().default(false).nonoptional(),
  medicationsDesc: z.string().optional(),
  healthStatus: z.string().optional(),
});

export const REGISTER_INPUTS: FormProps<RegisterFormSchema>["inputs"] = [
  {
    id: "name",
    label: "الاسم",
    name: "name",
    type: "text",
    placeholder: "أدخل اسمك ثلاثي",
  },
  {
    id: "phoneNumber",
    label: "رقم الهاتف",
    name: "phoneNumber",
    type: "tel",
    placeholder: "أدخل رقم هاتفك",
  },
  {
    id: "password",
    label: "كلمة المرور",
    name: "password",
    type: "password",
    placeholder: "أدخل كلمة المرور",
  },
  {
    id: "age",
    label: "السن",
    name: "age",
    type: "number",
    placeholder: "أدخل سنك",
  },
  {
    id: "address",
    label: "العنوان",
    name: "address",
    type: "text",
    placeholder: "أدخل عنوانك",
  },
  {
    id: "hasPastOperations",
    label: "هل لديك عمليات سابقة؟",
    name: "hasPastOperations",
    type: "checkbox",
  },
  {
    id: "pastOperationsDesc",
    label: "وصف عملياتك السابقة",
    name: "pastOperationsDesc",
    type: "textarea",
    placeholder: "وصف عملياتك السابقة",
    required: false,
  },
  {
    id: "isTakingMedications",
    label: "هل تستخدم أدوية؟",
    name: "isTakingMedications",
    type: "checkbox",
  },
  {
    id: "medicationsDesc",
    label: "وصف الأدوية التي تستخدمها",
    name: "medicationsDesc",
    type: "textarea",
    placeholder: "وصف الأدوية التي تستخدمها",
    required: false,
  },
  {
    id: "healthStatus",
    label: "الحالة الصحية",
    name: "healthStatus",
    type: "textarea",
    placeholder: "وصف الحالة الصحية (سكر - ضغط - ...)",
    required: false,
  },
];

// login
export const LOGIN_SCHEMA = z.object({
  name: z
    .string({ error: "الاسم ثلاثي باللغة العربية" })
    .regex(/^([\u0600-\u06FF]+\s){2}[\u0600-\u06FF]+$/, {
      error: "الاسم ثلاثي",
    }),
  phoneNumber: z
    .string({ error: "رقم هاتف غير صحيح" })
    .min(11, { error: "رقم هاتف غير صحيح" }),
  password: z.string({ error: "كلمة المرور غير صحيحة" }),
});

export const LOGIN_INPUTS: FormProps<LoginFormSchema>["inputs"] = [
  {
    id: "name",
    label: "الاسم",
    name: "name",
    type: "text",
    placeholder: "أدخل اسمك ثلاثي",
  },
  {
    id: "phoneNumber",
    label: "رقم الهاتف",
    name: "phoneNumber",
    type: "tel",
    placeholder: "أدخل رقم هاتفك",
  },
  {
    id: "password",
    label: "كلمة المرور",
    name: "password",
    type: "password",
    placeholder: "ادخل كلمة المرور",
  },
];
