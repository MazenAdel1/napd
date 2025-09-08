import { UserContext } from "@/UserProvider";
import { LoaderCircle } from "lucide-react";
import { use, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function HomeLayout() {
  const { user, isLoading } = use(UserContext);
  const router = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) router("/login");
    if (!isLoading && user?.role === "ADMIN") router("/admin");
  }, [isLoading, router, user]);

  if (isLoading)
    return <LoaderCircle className="animate-spin mx-auto size-10 mt-5" />;

  return (
    user && (
      <div className="container py-5">
        <Outlet />
      </div>
    )
  );
}
