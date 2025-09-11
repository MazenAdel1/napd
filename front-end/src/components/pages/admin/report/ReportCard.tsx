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

  if (isLoading) return <Skeleton className="bg-gray-300 block h-28" />;

  return (
    report && (
      <div className="rounded-md shadow p-2 relative group border-t-2 border-blue-400">
        <h3 className="font-semibold">{report.appointment?.user.name}</h3>
        <p className="whitespace-pre-wrap">{report.description}</p>

        <div className="absolute top-2 left-2 group-hover:opacity-100 opacity-0 transition-opacity flex items-center gap-2">
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
                  <LoaderCircle className="animate-spin size-5" />
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
