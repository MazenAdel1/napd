import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router";

export default function ReportLayout() {
  return (
    <>
      <Button asChild className="mb-3">
        <Link to="/admin/appointments">الرجوع</Link>
      </Button>
      <Outlet />
    </>
  );
}
