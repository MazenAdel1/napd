import { Link } from "react-router";

export default function Home() {
  return (
    <div className="flex gap-2 sm:flex-row flex-col h-[calc(100dvh-2.5rem)]">
      <Link
        to={"/time-slots"}
        className="bg-cyan-400 py-2 rounded-md px-1 flex justify-center items-center flex-1 h-full text-4xl font-semibold text-white"
      >
        احجز موعد
      </Link>
      <Link
        to={"/appointments"}
        className="bg-cyan-400 py-2 rounded-md px-1 flex justify-center items-center flex-1 h-full text-4xl font-semibold text-white"
      >
        حجوزاتي
      </Link>
    </div>
  );
}
