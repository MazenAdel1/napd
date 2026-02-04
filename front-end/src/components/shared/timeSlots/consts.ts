import { Moon, Sun, Sunset } from "lucide-react";

export const timeOfDayConfig = {
  morning: {
    icon: Sun,
    gradient: "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50",
    iconColor: "text-amber-500",
    borderColor: "border-amber-200",
    label: "صباحاً",
  },
  evening: {
    icon: Sunset,
    gradient: "bg-gradient-to-br from-orange-50 via-rose-50 to-purple-100",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200",
    label: "مساءً",
  },
  night: {
    icon: Moon,
    gradient: "bg-gradient-to-br from-indigo-50 via-purple-100 to-slate-100",
    iconColor: "text-indigo-500",
    borderColor: "border-indigo-200",
    label: "ليلاً",
  },
};
