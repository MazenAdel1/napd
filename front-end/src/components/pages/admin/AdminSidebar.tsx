import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CalendarCheck,
  NotebookText,
  User,
  Users,
} from "lucide-react";
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
      icon: Users,
    },
    {
      title: "الأوقات المتاحة",
      link: "/admin/time-slots",
      icon: Calendar,
    },
    {
      title: "الحجوزات",
      link: "/admin/appointments",
      icon: CalendarCheck,
    },
    {
      title: "التقارير",
      link: "/admin/reports",
      icon: NotebookText,
    },
    {
      title: "إضافة مسئول",
      link: "/admin/registerAdmin",
      icon: User,
    },
  ];
  return (
    <Sidebar side="right" className="bg-white px-2 shadow *:bg-white">
      <SidebarHeader className="bg-transparent text-2xl font-bold">
        صفحة المسئول
      </SidebarHeader>
      <SidebarContent>
        <ul className="mt-4 flex flex-col gap-2">
          {LINKS.map((link) => (
            <li key={link.title}>
              <Link
                to={link.link}
                className={cn(
                  `flex items-center gap-2 rounded-md border-gray-200 p-2 text-lg transition hover:bg-gray-100`,
                  router.pathname === link.link
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "",
                )}
              >
                {link.icon && <link.icon className="size-5" />}
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </SidebarContent>
    </Sidebar>
  );
}
