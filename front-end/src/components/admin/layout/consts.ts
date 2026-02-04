import {
  Calendar,
  CalendarCheck,
  NotebookText,
  User,
  Users,
} from "lucide-react";

export const LINKS = [
  {
    title: "الصفحة الرئيسية",
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
