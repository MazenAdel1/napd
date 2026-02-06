import Form from "@/components/shared/Form";
import type { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/lib/axios";
import axs from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { cn } from "@/lib/utils";
import { REPORT_INPUTS, REPORT_SCHEMA } from "./consts";
import type { ReportFormSchema, ReportFormType } from "./types";

export default function ReportForm<T extends Record<string, unknown>>(
  props: ReportFormType<T>,
) {
  const { className, status } = props;

  const router = useNavigate();

  const form = useForm<ReportFormSchema>({
    resolver: zodResolver(REPORT_SCHEMA),
  });

  const onSubmit: FormProps<ReportFormSchema>["onSubmit"] = async (values) => {
    try {
      switch (status) {
        case "CREATE":
          {
            await axios.post(`/reports/${props.appointmentId}`, values);
            router("/admin/reports");
          }
          break;
        case "UPDATE": {
          const { report } = (
            await axios.patch(`/reports/${props.reportId}`, values)
          ).data.data;

          props.setReport(report);
          props.closeRef?.current?.click();
        }
      }
    } catch (error) {
      form.setError(
        "root",
        axs.isAxiosError(error) ? error.response?.data : "حدث خطأ ما",
      );
    }
  };
  return (
    <Form<z.infer<typeof REPORT_SCHEMA>>
      form={form}
      inputs={REPORT_INPUTS(
        status === "UPDATE" ? props.defaultValue : undefined,
      )}
      onSubmit={onSubmit}
      submitText="تأكيد"
      className={cn("bg-none shadow-none", className)}
    />
  );
}
