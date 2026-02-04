import { ArrowLeft } from "lucide-react";
import { cn, getHoursMinutes } from "@/lib/utils";
import type { TimeSlotCardBaseProps } from "./types";
import { getTimeOfDay, isSlotTimeout } from "./utils";
import { timeOfDayConfig } from "./consts";

export default function TimeSlotCardBase({
  slot,
  actions,
  statusBadge,
  footer,
}: TimeSlotCardBaseProps) {
  const timeOfDay = getTimeOfDay(slot.startTime);
  const config = timeOfDayConfig[timeOfDay];
  const TimeIcon = config.icon;

  const slotTimeout = isSlotTimeout(slot.startTime);

  return (
    <div
      key={slot.id}
      className={cn(
        "relative flex flex-col gap-2 rounded-xl border-2 p-3 text-black transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10",
        config.gradient,
        config.borderColor,
        slotTimeout && slot.status === "AVAILABLE"
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
      {slot.status === "AVAILABLE" && slotTimeout && (
        <div className="mt-auto flex items-center justify-center gap-1 rounded-lg bg-red-100 py-1.5 text-sm text-red-600">
          انقضى وقت هذا الموعد
        </div>
      )}

      {/* Footer slot (book button for client) */}
      {footer}
    </div>
  );
}
