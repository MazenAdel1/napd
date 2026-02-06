import { Calendar, ListOrderedIcon, UserCircle } from "lucide-react";
import { Link } from "react-router";
import Logout from "../shared/Logout";

export default function Home() {
  return (
    <main className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-gray-700">الرئيسية</h1>
          <p className="text-lg text-gray-600">مرحبا بك في نظام الحجوزات</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <UserCircle className="size-8 text-gray-700" />
          </Link>
          <Logout />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <Link
          to={"/time-slots"}
          className="flex h-50 w-full items-center justify-center gap-4 rounded-md border-3 border-blue-900 bg-blue-600 px-1 py-2 text-4xl font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          <Calendar className="size-10" /> احجز موعد
        </Link>
        <Link
          to={"/appointments"}
          className="flex h-50 w-full items-center justify-center gap-4 rounded-md border-3 border-blue-900 bg-blue-600 px-1 py-2 text-4xl font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          <ListOrderedIcon className="size-10" /> حجوزاتي
        </Link>
      </div>
    </main>
  );
}
