import { Outlet } from "react-router";

export default function HomeLayout() {
  return (
    <div className="container py-5">
      <Outlet />
    </div>
  );
}
