import type { Slot } from "@/types";
import { ArrowLeft, Sun, Moon, Sunset } from "lucide-react";
import { cn, getHoursMinutes } from "@/lib/utils";
import React from "react";

export type TimeSlotCardBaseProps = {
  slot: Slot;
  actions?: React.ReactNode;
  statusBadge?: React.ReactNode;
  footer?: React.ReactNode;
};

// Helper to determine time of day from slot start time
const getTimeOfDay = (startTime: string) => {
  const hour = new Date(startTime).getHours();
  if (hour >= 0 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "evening";
  return "night";
};

// Time of day configurations
const timeOfDayConfig = {
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

export default function TimeSlotCardBase({
  slot,
  actions,
  statusBadge,
  footer,
}: TimeSlotCardBaseProps) {
  const timeOfDay = getTimeOfDay(slot.startTime);
  const config = timeOfDayConfig[timeOfDay];
  const TimeIcon = config.icon;

  const isSlotTimeout = new Date(slot.startTime) < new Date();

  return (
    <div
      key={slot.id}
      className={cn(
        "relative flex flex-col gap-2 rounded-xl border-2 p-3 text-black transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10",
        config.gradient,
        config.borderColor,
        isSlotTimeout && slot.status === "AVAILABLE"
          ? "border-t-4 border-t-red-400 opacity-75"
          : slot.status === "AVAILABLE"
            ? "border-t-4 border-t-green-400"
            : "border-t-4 border-t-gray-300",
      )}
    >
      {/* Actions slot (delete menu for admin) */}
      {actions}

      {/* Time display with icon */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold sm:text-base">
        <div className="flex items-center gap-1.5 rounded-lg bg-white/60 px-2 py-1 backdrop-blur-sm">
          <span>{getHoursMinutes(slot.startTime)}</span>
          <ArrowLeft className="size-4" />
          <span>{getHoursMinutes(slot.endTime)}</span>
        </div>

        <div className="flex flex-col items-center justify-center self-end">
          <div className={cn("shrink-0", config.iconColor)}>
            <TimeIcon className="size-5 opacity-70" />
          </div>
          <span className={cn("text-xs font-medium", config.iconColor)}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Status badge slot */}
      {statusBadge}

      {/* Timeout message */}
      {slot.status === "AVAILABLE" && isSlotTimeout && (
        <div className="mt-auto flex items-center justify-center gap-1 rounded-lg bg-red-100 py-1.5 text-sm text-red-600">
          انقضى وقت هذا الموعد
        </div>
      )}

      {/* Footer slot (book button for client) */}
      {footer}
    </div>
  );
}
