import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <Outlet />
    </div>
  );
}
