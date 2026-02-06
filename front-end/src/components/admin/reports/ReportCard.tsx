import type { Report } from "./types";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ReportForm from "./ReportForm";
import { Skeleton } from "@/components/ui/skeleton";
import ActionsMenu from "@/components/shared/ActionsMenu";

export default function ReportCard(props: Partial<Report> | null) {
  const { reportId } = useParams();
  const [report, setReport] = useState(props);
  const [isLoading, setIsLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const router = useNavigate();

  useEffect(() => {
    if (reportId) {
      (async () => {
        setIsLoading(true);
        const { report: reportData } = (
          await axios.get("/reports", {
            params: {
              id: reportId,
            },
          })
        ).data.data;

        setReport(reportData);
        setIsLoading(false);
      })();
    }
  }, [reportId, props]);

  const deleteReport = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/reports/${report?.id}`);
      setReport(null);
      router("/admin/reports");
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <Skeleton className="block h-28 bg-gray-300" />;

  return (
    report && (
      <div className="group relative flex rounded-md border-t-2 border-blue-400 bg-white p-3 shadow">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {report.appointment?.user.name}
          </h3>
          <p className="whitespace-pre-wrap">{report.description}</p>
        </div>

        <ActionsMenu
          EditForm={(closeRef) => (
            <ReportForm
              status="UPDATE"
              reportId={report.id!}
              setReport={setReport}
              defaultValue={report.description}
              closeRef={closeRef}
            />
          )}
          deleteAction={deleteReport}
          isDeleting={isDeleting}
        />
      </div>
    )
  );
}
