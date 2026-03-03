import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { SidebarContext } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  data: unknown[];
  title: string;
  link: string;
  seeAllButton?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
};

export default function DataTemplate({
  data,
  title,
  link,
  seeAllButton = false,
  isLoading = false,
  children,
}: Props) {
  const sidebarContext = use(SidebarContext);

  return (
    <div className="flex flex-col gap-6 pt-3 pb-15">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        {seeAllButton && data.length > 0 && (
          <Button asChild variant={"outline"}>
            <Link to={link}>رؤية الكل</Link>
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {" "}
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="block h-52 w-full bg-gray-300" />
          ))}
        </div>
      ) : data.length > 0 ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            sidebarContext?.open &&
              "md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {children}
        </div>
      ) : (
        <p className="py-2 text-xl font-semibold">لا يوجد {title.slice(2)}</p>
      )}
    </div>
  );
}
