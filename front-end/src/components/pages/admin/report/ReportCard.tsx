import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Report } from "@/types";
import axios from "@/lib/axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ReportForm from "./ReportForm";
import { Button } from "@/components/ui/button";
import { Edit, LoaderCircle, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportCard(props: Partial<Report> | null) {
  const { reportId } = useParams();
  const [report, setReport] = useState(props);
  const [isLoading, setIsLoading] = useState(false);

  const closeRef = useRef<HTMLButtonElement>(null);
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
      <div className="group relative rounded-md border-t-2 border-blue-400 bg-white p-3 shadow">
        <h3 className="text-lg font-semibold">
          {report.appointment?.user.name}
        </h3>
        <p className="whitespace-pre-wrap">{report.description}</p>

        <div className="absolute top-2 left-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Edit />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogClose className="sr-only" ref={closeRef} />
              <ReportForm
                className={"bg-inherit shadow-none"}
                status="UPDATE"
                reportId={report.id!}
                setReport={setReport}
                defaultValue={report.description}
                closeRef={closeRef}
              />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"}>
                <Trash />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <p className="text-center">هل أنت متأكد من حذف هذا التقرير؟</p>
              <Button
                variant={"destructive"}
                onClick={deleteReport}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoaderCircle className="size-5 animate-spin" />
                ) : (
                  "حذف"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  );
}
