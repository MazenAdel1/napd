const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create some times
  const time1 = await prisma.time.create({
    data: { time: new Date("2025-08-12T09:00:00Z") },
  });
  const time2 = await prisma.time.create({
    data: { time: new Date("2025-08-12T10:00:00Z") },
  });

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      phoneNumber: "1234567890",
      age: 30,
      address: "123 Main St",
      hasPastOperations: true,
      pastOperationsDesc: "Appendix removal",
      isTakingMedications: true,
      medicationsDesc: "Painkillers",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      phoneNumber: "9876543210",
      age: 25,
      address: "456 Elm St",
      hasPastOperations: false,
      pastOperationsDesc: "",
      isTakingMedications: false,
      medicationsDesc: "",
    },
  });

  // Create appointments
  await prisma.appointment.create({
    data: {
      userId: user1.id,
      timeId: time1.id,
    },
  });

  await prisma.appointment.create({
    data: {
      userId: user2.id,
      timeId: time2.id,
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
