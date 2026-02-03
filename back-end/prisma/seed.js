require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

  const bcrypt = require("bcryptjs");
  const adminPassword = await bcrypt.hash("134652", 10);

  // Create ADMIN
  await prisma.user.create({
    data: {
      name: "مازن عادل منيسي",
      phoneNumber: "01008142981",
      role: "ADMIN",
      password: adminPassword,
    },
  });

  const clientPassword = await bcrypt.hash("123132", 10);

  // Create CLIENT
  const client = await prisma.user.create({
    data: {
      name: "محمد أحمد محمود",
      phoneNumber: "01012312312",
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
