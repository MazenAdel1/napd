import { Link, useNavigate } from "react-router";
import Form from "@/components/shared/Form";
import type { FormProps } from "@/types";
import axios from "@/lib/axios";
import axs from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { UserContext } from "@/UserProvider";
import { LOGIN_INPUTS, LOGIN_SCHEMA } from "./consts";
import type { LoginFormSchema } from "./types";
import { reconnectSocket } from "@/lib/consts";

export default function Login() {
  const { setUser } = useContext(UserContext);

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(LOGIN_SCHEMA),
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
      reconnectSocket(); // Reconnect socket with new auth credentials

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
      inputs={LOGIN_INPUTS}
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
