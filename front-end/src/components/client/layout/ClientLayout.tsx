import { UserContext } from "@/UserProvider";
import { LoaderCircle } from "lucide-react";
import { use, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function ClientLayout() {
  const { user, isLoading } = use(UserContext);
  const router = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) router("/login");
    if (!isLoading && user?.role === "ADMIN") router("/admin");
  }, [isLoading, router, user]);

  if (isLoading)
    return <LoaderCircle className="mx-auto mt-5 size-10 animate-spin" />;

  return (
    user && (
      <div className="p-4">
        <Outlet />
      </div>
    )
  );
}
