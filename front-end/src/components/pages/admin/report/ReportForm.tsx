import Form from "@/components/Form";
import type { FormProps, ReportForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/lib/axios";
import axs from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

export default function ReportForm<T extends Record<string, unknown>>(
  props: ReportForm<T>
) {
  const { className, status } = props;

  const router = useNavigate();

  type ReportFormSchema = z.infer<typeof SCHEMA>;

  const SCHEMA = z.object({
    description: z.string("نص التقرير مطلوب"),
  });

  const INPUTS: FormProps<ReportFormSchema>["inputs"] = [
    {
      id: "description",
      label: "نص التقرير",
      name: "description",
      type: "textarea",
      placeholder: "اكتب نص التقرير هنا",
      defaultValue: status === "UPDATE" ? props.defaultValue : undefined,
    },
  ];

  const form = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
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
        axs.isAxiosError(error) ? error.response?.data : "حدث خطأ ما"
      );
    }
  };
  return (
    <Form<z.infer<typeof SCHEMA>>
      form={form}
      inputs={INPUTS}
      onSubmit={onSubmit}
      submitText="تأكيد"
      className={className}
    />
  );
}
