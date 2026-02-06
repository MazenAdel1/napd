import { cn } from "@/lib/utils";
import { Outlet } from "react-router";
import type { ClassNameValue } from "tailwind-merge";

export default function AuthLayout({
  className,
}: {
  className?: ClassNameValue;
}) {
  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center gap-4 px-3 py-2",
        className,
      )}
    >
      <img src="/system-logo-2.png" alt="System Logo" className="h-24 w-24" />
      <Outlet />
    </div>
  );
}
