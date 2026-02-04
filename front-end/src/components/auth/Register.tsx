import { Link, useNavigate } from "react-router";
import Form from "@/components/shared/Form";
import { socket } from "@/lib/consts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { FormProps } from "@/types";
import { REGISTER_INPUTS, REGISTER_SCHEMA } from "./consts";
import type { RegisterFormSchema } from "./types";

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState<string | null>("");

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(REGISTER_SCHEMA),
  });

  const router = useNavigate();

  useEffect(() => {
    const handleSuccess = () => {
      setIsSubmitting(false);
      setIsError(null);
      router("/login");
    };

    const handleError = (errorMessage: string) => {
      setIsError(errorMessage);
      setIsSubmitting(false);
    };

    socket.on("client add success", handleSuccess);
    socket.on("client add fail", (error) => handleError(error.message));

    return () => {
      socket.off("client add success", handleSuccess);
      socket.off("client add fail", (error) => handleError(error.message));
    };
  }, [form, router]);

  const onSubmit: FormProps<RegisterFormSchema>["onSubmit"] = async (
    values,
  ) => {
    setIsSubmitting(true);
    setIsError(null);
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
            message: isError,
          },
        },
      }),
    },
  };

  return (
    <Form
      form={formWithLoadingState}
      inputs={REGISTER_INPUTS}
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
