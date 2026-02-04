import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router";
import { LINKS } from "./consts";

export default function AdminSidebar() {
  const router = useLocation();

  return (
    <Sidebar side="right" className="bg-white px-2 shadow *:bg-white">
      <SidebarHeader className="flex-row items-center bg-transparent">
        <img
          src="/system-logo-2.png"
          alt="Napd system logo"
          className="w-10"
          width={100}
          height={100}
        />
        <h2 className="text-xl font-bold">صفحة المسئول</h2>
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
