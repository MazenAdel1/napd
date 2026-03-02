import { UserContext } from "@/UserProvider";
import { use, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LoaderCircle } from "lucide-react";
import Notifications from "../Notifications";

export default function AdminLayout() {
  const { user, isLoading } = use(UserContext);
  const router = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) router("/");
  }, [isLoading, router, user]);

  if (isLoading)
    return <LoaderCircle className="mx-auto mt-5 size-10 animate-spin" />;

  return (
    user?.role === "ADMIN" && (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarTrigger />
        <main className="w-full p-4 pt-12">
          <Notifications />
          <Outlet />
        </main>
      </SidebarProvider>
    )
  );
}
