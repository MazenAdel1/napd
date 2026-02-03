import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import type { DataWrapper, Report } from "@/types";
import DataTemplate from "@/components/shared/DataTemplate";

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

  return (
    <DataTemplate
      data={reports}
      title="التقارير"
      link="/admin/reports"
      seeAllButton={seeAllButton}
      isLoading={isLoading}
    >
      {reports.map((report) => (
        <ReportCard {...report} key={report.id} />
      ))}
    </DataTemplate>
  );
}
