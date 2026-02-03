import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function ReportLayout() {
  return (
    <section className="flex flex-col gap-4">
      <Button asChild variant={"outline"} className="w-fit">
        <Link to="/admin/appointments">
          <ArrowRight className="size-4" />
          الرجوع
        </Link>
      </Button>
      <Outlet />
    </section>
  );
}
