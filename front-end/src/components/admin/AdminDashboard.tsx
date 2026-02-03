import { AdminAppointments } from "@/components/admin/appointments";
import Reports from "@/components/admin/reports/Reports";
import Clients from "@/components/admin/clients/Clients";

export default function AdminDashboard() {
  return (
    <div className="pb-4">
      <AdminAppointments limit={4} seeAllButton />
      <hr className="my-15 border border-gray-300" />
      <Clients limit={4} seeAllButton />
      <hr className="my-15 border border-gray-300" />
      <Reports limit={4} seeAllButton />
    </div>
  );
}
