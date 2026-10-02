import { prisma } from "../src/lib/prisma";

async function main() {
  // Clean up existing data in reverse order of dependencies
  await prisma.vote.deleteMany();
  await prisma.electionVoter.deleteMany();
  await prisma.electionAdmin.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.election.deleteMany();
  await prisma.user.deleteMany();

  // 1. Super Admin (BR-02: Single Super Admin, created via seed)
  const superAdmin = await prisma.user.create({
    data: {
      username: "superadmin",
      password: "superadmin123",
      name: "Super Administrator",
      role: "SUPER_ADMIN",
    },
  });

  // 2. Admin (Created by Super Admin)
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      password: "admin123",
      name: "Administrator",
      role: "ADMIN",
      createdById: superAdmin.id,
    },
  });

  // 3. Voters (Created by Super Admin or Admin)
  const andi = await prisma.user.create({
    data: {
      username: "andi",
      password: "andi123",
      name: "Andi",
      role: "VOTER",
      createdById: admin.id,
    },
  });

  const budi = await prisma.user.create({
    data: {
      username: "budi",
      password: "budi123",
      name: "Budi",
      role: "VOTER",
      createdById: admin.id,
    },
  });

  const citra = await prisma.user.create({
    data: {
      username: "citra",
      password: "citra123",
      name: "Citra",
      role: "VOTER",
      createdById: superAdmin.id,
    },
  });

  // 4. Election (Created by Super Admin)
  const election = await prisma.election.create({
    data: {
      title: "Pemilihan Ketua 2026",
      description: "Pemilihan ketua organisasi tahun 2026",
    },
  });

  // 6. Candidates for Election
  const ahmad = await prisma.candidate.create({
    data: {
      name: "Ahmad",
      description: "Kandidat nomor 1",
      electionId: election.id,
    },
  });

  const budiCandidate = await prisma.candidate.create({
    data: {
      name: "Budi",
      description: "Kandidat nomor 2",
      electionId: election.id,
    },
  });

  const citraCandidate = await prisma.candidate.create({
    data: {
      name: "Citra",
      description: "Kandidat nomor 3",
      electionId: election.id,
    },
  });

  // 7. Election Voters
  await prisma.electionVoter.createMany({
    data: [
      {
        electionId: election.id,
        userId: andi.id,
      },
      {
        electionId: election.id,
        userId: budi.id,
      },
      {
        electionId: election.id,
        userId: citra.id,
      },
    ],
  });

  console.log("Seeding finished successfully:", {
    superAdmin: superAdmin.username,
    admin: admin.username,
    voters: [andi.username, budi.username, citra.username],
    election: election.title,
    assignedAdmin: admin.username,
    candidates: [ahmad.name, budiCandidate.name, citraCandidate.name],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
