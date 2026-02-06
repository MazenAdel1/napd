import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { use } from "react";
import { UserContext } from "@/UserProvider";
import axios from "@/lib/axios";

export default function Logout({ className }: { className?: ClassNameValue }) {
  const navigate = useNavigate();
  const { setUser } = use(UserContext);

  return (
    <Button
      className={cn(
        "border border-red-300 bg-red-100 text-red-500 hover:bg-red-200",
        className,
      )}
      onClick={async () => {
        await axios.post("/users/logout");
        setUser(null);
        navigate("/login");
      }}
    >
      تسجيل الخروج
      <LogOut className="size-4" />
    </Button>
  );
}
