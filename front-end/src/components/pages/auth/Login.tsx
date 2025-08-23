import z from "zod";
import { Link, useNavigate } from "react-router";
import Form, { type FormProps } from "@/components/Form";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { UserContext } from "@/UserProvider";

export default function Login() {
  const { setUser } = useContext(UserContext);

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
      placeholder: "ادخل كلمة المرور",
    },
  ];

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

  const form = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
  });

  const router = useNavigate();

  const onSubmit: FormProps["onSubmit"] = async (values, form) => {
    try {
      const { status } = (
        await axios.post("http://localhost:3000/api/users/login", values, {
          withCredentials: true,
        })
      ).data;

      const { user } = (
        await axios.get("http://localhost:3000/api/users/getUserByToken", {
          withCredentials: true,
        })
      ).data.data;

      setUser(user);

      if (status.code === 200) {
        router("/");
      }
    } catch (error) {
      form.setError("root", { message: error?.response?.data.message });
    }
  };
  // update user in cookies
  return (
    <Form
      form={form}
      inputs={INPUTS}
      schema={SCHEMA}
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
