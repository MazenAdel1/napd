import z, { set } from "zod";
import { Link } from "react-router";
import Form, { type FormProps } from "@/components/Form";
import { socket } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

export default function Register() {
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
    age: z.coerce.number(),
    address: z.string(),
    hasPastOperations: z.boolean(),
    pastOperationsDesc: z.string().optional(),
    isTakingMedications: z.boolean(),
    medicationsDesc: z.string().optional(),
  });

  type FormData = z.infer<typeof SCHEMA>;

  const form = useForm<FormData>({
    resolver: zodResolver(SCHEMA),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const handleSuccess = () => {
      setIsSubmitting(false);
      setIsError(false);
    };

    const handleError = () => {
      setIsSubmitting(false);
      setIsError(true);
    };

    socket.on("client add success", handleSuccess);
    socket.on("client add fail", handleError);

    return () => {
      socket.off("client add success", handleSuccess);
      socket.off("client add fail", handleError);
    };
  }, [form]);

  const onSubmit: FormProps["onSubmit"] = async (values) => {
    setIsSubmitting(true);
    setIsError(false);
    socket.emit("add client", values);
  };

  const formWithLoadingState = {
    ...form,
    formState: {
      ...form.formState,
      isSubmitting: isSubmitting || form.formState.isSubmitting,
      ...(isError && {
        errors: {
          root: {
            message: "المستخدم موجود بالفعل",
          },
        },
      }),
    },
  };

  return (
    <Form
      form={formWithLoadingState}
      inputs={INPUTS}
      schema={SCHEMA}
      onSubmit={onSubmit}
      submitText="سجل الحساب"
      additionalContent={
        <p>
          تمتلك حسابا بالفعل؟{" "}
          <Link to={"/login"} className="underline hover:no-underline">
            تسجيل الدخول
          </Link>
        </p>
      }
    />
  );
}
