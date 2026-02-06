import type { InfoItemProps } from "./types";

export default function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">
          {value || "غير متوفر"}
        </span>
      </div>
    </div>
  );
}
