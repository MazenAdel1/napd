import { UserContext } from "@/UserProvider";
import { use } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout() {
  const { user } = use(UserContext);

  if (!user || user.role !== "ADMIN")
    return <h1 className="text-3xl text-center py-4">غير مسموح بالدخول</h1>;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="px-4 w-full">
        <SidebarTrigger className="-mr-4" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
