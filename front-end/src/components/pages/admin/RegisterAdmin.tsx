import z from "zod";
import Form, { type FormProps } from "@/components/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";

export default function RegisterAdmin() {
  const [isSuccess, setIsSuccess] = useState(false);

  const INPUTS: FormProps["inputs"] = [
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
  ];

  const SCHEMA = z.object({
    name: z
      .string({ error: "الاسم ثلاثي باللغة العربية" })
      .regex(/^([\u0600-\u06FF]+\s){2}[\u0600-\u06FF]+$/, {
        error: "الاسم ثلاثي",
      }),
    phoneNumber: z
      .string()
      .regex(/^\d+$/, "يجب أن يحتوى رقم الهاتف على أرقام فقط")
      .length(11, { error: "رقم هاتف غير صحيح" }),
    password: z
      .string()
      .min(6, { error: "كلمة المرور يجب ان تكون على الاقل 6 حروف" }),
  });

  type FormData = z.infer<typeof SCHEMA>;

  const form = useForm<FormData>({
    resolver: zodResolver(SCHEMA),
  });

  const onSubmit = async (values) => {
    try {
      await axios.post(
        "http://localhost:3000/api/users/registerAdmin",
        values,
        {
          withCredentials: true,
        }
      );
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      form={form}
      inputs={INPUTS}
      schema={SCHEMA}
      onSubmit={onSubmit}
      submitText="سجل الحساب"
      additionalContent={
        isSuccess && (
          <p className="text-green-500 font-bold">تم إضافة مسئول بنجاح</p>
        )
      }
    />
  );
}
