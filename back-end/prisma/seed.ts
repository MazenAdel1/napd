import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Create some times
  const time1 = await prisma.timeSlot.create({
    data: {
      startTime: new Date("2026-02-03T09:00:00Z"),
      endTime: new Date("2026-02-03T10:00:00Z"),
      date: new Date("2026-02-03"),
    },
  });
  const time2 = await prisma.timeSlot.create({
    data: {
      startTime: new Date("2026-02-03T11:00:00Z"),
      endTime: new Date("2026-02-03T12:00:00Z"),
      date: new Date("2026-02-03"),
    },
  });

  const adminPassword = await bcrypt.hash("123123", 10);

  // Create ADMIN
  await prisma.user.create({
    data: {
      name: "مازن أدمن النظام",
      phoneNumber: "12312312312",
      role: "ADMIN",
      password: adminPassword,
    },
  });

  const clientPassword = await bcrypt.hash("123123", 10);

  // Create CLIENT
  const client = await prisma.user.create({
    data: {
      name: "م م م",
      phoneNumber: "12312312313",
      age: 25,
      address: "الشارع الجديد",
      hasPastOperations: false,
      isTakingMedications: false,
      password: clientPassword,
    },
  });

  // Create appointments
  await prisma.appointment.create({
    data: {
      userId: client.id,
      timeSlotId: time1.id,
    },
  });

  await prisma.appointment.create({
    data: {
      userId: client.id,
      timeSlotId: time2.id,
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
