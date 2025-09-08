import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router";

export default function AdminSidebar() {
  const router = useLocation();
  const LINKS = [
    {
      title: "الصفحة الرئيسية",
      link: "/admin",
    },
    {
      title: "العملاء",
      link: "/admin/clients",
    },
    {
      title: "الأوقات المتاحة",
      link: "/admin/time-slots",
    },
    {
      title: "الحجوزات",
      link: "/admin/appointments",
    },
    {
      title: "التقارير",
      link: "/admin/reports",
    },
    {
      title: "إضافة مسئول",
      link: "/admin/registerAdmin",
    },
  ];
  return (
    <Sidebar side="right" className="px-2 bg-gray-100">
      <SidebarHeader className="text-2xl font-bold">صفحة المسئول</SidebarHeader>
      <SidebarContent>
        <ul className="mt-4 flex flex-col gap-2">
          {LINKS.map((link) => (
            <li key={link.title}>
              <Link
                to={link.link}
                className={cn(
                  `block text-lg p-2 rounded-md border-2 border-gray-200 hover:bg-gray-100 transition`,
                  router.pathname === link.link
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : ""
                )}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarContent>
    </Sidebar>
  );
}
