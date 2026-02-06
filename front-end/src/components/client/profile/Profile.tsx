import { UserContext } from "@/UserProvider";
import { use } from "react";
import EditProfile from "./EditProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import {
  ArrowRight,
  Heart,
  MapPin,
  Phone,
  Pill,
  Stethoscope,
  Syringe,
  User,
} from "lucide-react";
import SectionCard from "./SectionCard";
import InfoItem from "./InfoItem";

export default function Profile() {
  const { user } = use(UserContext);

  return (
    <main className="flex flex-col gap-8">
      <Button asChild variant={"outline"} className="w-fit">
        <Link to="..">
          <ArrowRight /> الرجوع
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
            <User className="size-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.name || "---"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{user?.age ? `${user.age} سنة` : ""}</span>
              {user?.age && user?.address && <span>•</span>}
              <span>{user?.address}</span>
            </div>
          </div>
        </div>
        <EditProfile />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Personal Info */}
        <SectionCard
          title="المعلومات الشخصية"
          icon={<User className="size-5" />}
        >
          <div className="flex flex-col gap-5">
            <InfoItem
              icon={<User className="size-4" />}
              label="الاسم"
              value={user?.name}
            />
            <InfoItem
              icon={<Phone className="size-4" />}
              label="رقم الهاتف"
              value={user?.phoneNumber}
            />
            <InfoItem
              icon={<MapPin className="size-4" />}
              label="العنوان"
              value={user?.address}
            />
          </div>
        </SectionCard>

        {/* Health Status */}
        <SectionCard title="الحالة الصحية" icon={<Heart className="size-5" />}>
          <div className="flex flex-col gap-5">
            <InfoItem
              icon={<Stethoscope className="size-4" />}
              label="الحالة الصحية"
              value={user?.healthStatus || "لا يوجد"}
            />
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-gray-400">
                <Syringe className="size-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">عمليات سابقة</span>
                <Badge variant={user?.hasPastOperations ? "note" : "success"}>
                  {user?.hasPastOperations ? "نعم" : "لا"}
                </Badge>
                {user?.hasPastOperations && user?.pastOperationsDesc && (
                  <p className="mt-1 text-sm text-gray-600">
                    {user.pastOperationsDesc}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-gray-400">
                <Pill className="size-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">أدوية حالية</span>
                <Badge variant={user?.isTakingMedications ? "note" : "success"}>
                  {user?.isTakingMedications ? "نعم" : "لا"}
                </Badge>
                {user?.isTakingMedications && user?.medicationsDesc && (
                  <p className="mt-1 text-sm text-gray-600">
                    {user.medicationsDesc}
                  </p>
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
