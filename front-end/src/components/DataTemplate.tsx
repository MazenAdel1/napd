import { Link } from "react-router";
import { Button } from "./ui/button";

type Props = {
  data: unknown[];
  title: string;
  link: string;
  seeAllButton?: boolean;
  children: React.ReactNode;
};

export default function DataTemplate({
  data,
  title,
  link,
  seeAllButton = false,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="py-3 text-3xl font-bold">{title}</h1>
        {seeAllButton && data.length > 0 && (
          <Button asChild variant={"outline"}>
            <Link to={link}>رؤية الكل</Link>
          </Button>
        )}
      </div>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {children}
        </div>
      ) : (
        <p className="py-2 text-xl font-semibold">لا يوجد {title.slice(2)}</p>
      )}
    </div>
  );
}
