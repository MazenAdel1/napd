import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import type { DataWrapper, Report } from "@/types";
import DataTemplate from "@/components/DataTemplate";

export default function Reports({ limit, seeAllButton }: DataWrapper) {
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="block h-52 w-full bg-gray-300" />
        ))}
      </div>
    );

  return (
    <DataTemplate
      data={reports}
      title="التقارير"
      link="/admin/reports"
      seeAllButton={seeAllButton}
    >
      {reports.map((report) => (
        <ReportCard {...report} key={report.id} />
      ))}
    </DataTemplate>
  );
}
