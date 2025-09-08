import { UserContext } from "@/UserProvider";
import { use, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LoaderCircle } from "lucide-react";

export default function AdminLayout() {
  const { user, isLoading } = use(UserContext);
  const router = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) router("/");
  }, [isLoading, router, user]);

  if (isLoading)
    return <LoaderCircle className="animate-spin mx-auto size-10 mt-5" />;

  return (
    user?.role === "ADMIN" && (
      <SidebarProvider>
        <AdminSidebar />
        <main className="px-4 w-full">
          <SidebarTrigger className="-mr-4 ml-4" />
          <Outlet />
        </main>
      </SidebarProvider>
    )
  );
}
