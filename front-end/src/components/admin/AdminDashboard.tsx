import { AdminAppointments } from "@/components/admin/appointments";
import Reports from "@/components/admin/reports/Reports";
import Clients from "@/components/admin/clients/Clients";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col divide-y-2 divide-gray-300">
      <AdminAppointments limit={4} seeAllButton />
      <Clients limit={4} seeAllButton />
      <Reports limit={4} seeAllButton />
    </div>
  );
}
