import Appointments from "@/components/appointments/Appointments";
import Reports from "./report/Reports";
import Clients from "./Clients";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function AdminPage() {
  return (
    <div className="pb-4">
      <section className="flex flex-col gap-4">
        <Appointments limit={4} />
        <Button asChild variant={"outline"}>
          <Link to={"/admin/appointments"}>رؤية الباقي</Link>
        </Button>
      </section>
      <hr className="my-5 border-1 border-gray-300" />
      <section className="flex flex-col gap-4">
        <Clients limit={4} />
        <Button asChild variant={"outline"}>
          <Link to={"/admin/clients"}>رؤية الباقي</Link>
        </Button>
      </section>
      <hr className="my-5 border-1 border-gray-300" />
      <section className="flex flex-col gap-4">
        <Reports limit={4} />
        <Button asChild variant={"outline"}>
          <Link to={"/admin/reports"}>رؤية الباقي</Link>
        </Button>
      </section>
    </div>
  );
}
