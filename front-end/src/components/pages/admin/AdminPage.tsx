import Appointments from "@/components/appointments/Appointments";
import Reports from "./report/Reports";
import Clients from "./Clients";

export default function AdminPage() {
  return (
    <div className="pb-4">
      <Appointments limit={4} seeAllButton />
      <hr className="my-15 border-1 border-gray-300" />
      <Clients limit={4} seeAllButton />
      <hr className="my-15 border-1 border-gray-300" />
      <Reports limit={4} seeAllButton />
    </div>
  );
}
