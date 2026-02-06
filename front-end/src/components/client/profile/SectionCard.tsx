import { Separator } from "@/components/ui/separator";
import type { SectionCardProps } from "./types";

export default function SectionCard({
  title,
  icon,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-gray-700">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <Separator className="mb-4" />
      {children}
    </div>
  );
}
