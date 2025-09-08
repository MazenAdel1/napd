import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import type { Report } from "@/types";

export default function Reports({ limit }: { limit?: number }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { reports } = (
        await axios.get("/reports", {
          withCredentials: true,
          params: { limit },
        })
      ).data.data;

      setReports(reports);
      setIsLoading(false);
    })();
  }, [limit]);

  if (isLoading)
    return (
      <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="block h-52 w-full bg-gray-300" />
        ))}
      </div>
    );

  return reports.length > 0 ? (
    <>
      <h1 className="text-3xl font-bold py-3">التقارير</h1>
      <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {reports.map((report) => (
          <ReportCard {...report} key={report.id} />
        ))}
      </div>
    </>
  ) : (
    <p className="text-xl font-semibold py-2">لا يوجد تقارير حاليا</p>
  );
}
