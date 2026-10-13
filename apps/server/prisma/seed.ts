import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/utils/password";

const main = async (): Promise<void> => {
  console.log("Starting database cleanup...");
  // Clean up existing data in reverse order of foreign key dependencies
  await prisma.vote.deleteMany();
  await prisma.candidatePair.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.electionVoter.deleteMany();
  await prisma.electionAdmin.deleteMany();
  await prisma.election.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding Super Admin...");
  // BR-02: Single Super Admin, created via seed
  await prisma.user.create({
    data: {
      username: "superadmin",
      password: await hashPassword("superadmin123"),
      name: "Super Administrator",
      role: "SUPER_ADMIN",
    },
  });

  console.log("\n========================================================");
  console.log("Seeding completed successfully!");
  console.log("========================================================");
  console.log("Credentials available for testing:");
  console.log("1. Super Admin -> username: superadmin | password: superadmin123");
  console.log("========================================================\n");
};

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
