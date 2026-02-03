import z from "zod";
import { Link, useNavigate } from "react-router";
import Form from "@/components/shared/Form";
import type { FormProps } from "@/types";
import axios from "@/lib/axios";
import axs from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { UserContext } from "@/UserProvider";

export default function Login() {
  const { setUser } = useContext(UserContext);

  const SCHEMA = z.object({
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

  type LoginFormSchema = z.infer<typeof SCHEMA>;

  const INPUTS: FormProps<LoginFormSchema>["inputs"] = [
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

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(SCHEMA),
  });

  const router = useNavigate();

  const onSubmit: FormProps<LoginFormSchema>["onSubmit"] = async (
    values,
    form,
  ) => {
    try {
      await axios.post("/users/login", values, {
        withCredentials: true,
      });

      const { user } = (
        await axios.get("/users/getUserByToken", {
          withCredentials: true,
        })
      ).data.data;

      setUser(user);

      if (user.role === "ADMIN") router("/admin");
      else router("/");
    } catch (error) {
      form.setError("root", {
        message: axs.isAxiosError(error)
          ? error.response?.data.message
          : "حدث خطأ ما",
      });
    }
  };
  return (
    <Form
      form={form}
      inputs={INPUTS}
      onSubmit={onSubmit}
      submitText="تسجيل الدخول"
      additionalContent={
        <p>
          لا تمتلك حسابا؟{" "}
          <Link to={"/register"} className="underline hover:no-underline">
            سجل حساب
          </Link>
        </p>
      }
    />
  );
}
