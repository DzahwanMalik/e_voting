import { prisma } from "../src/lib/prisma";

async function main() {
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      password: "admin123",
      name: "Administrator",
      role: "ADMIN",
    },
  });

  const andi = await prisma.user.create({
    data: {
      username: "andi",
      password: "andi123",
      name: "Andi",
      role: "VOTER",
    },
  });

  const budi = await prisma.user.create({
    data: {
      username: "budi",
      password: "budi123",
      name: "Budi",
      role: "VOTER",
    },
  });

  const citra = await prisma.user.create({
    data: {
      username: "citra",
      password: "citra123",
      name: "Citra",
      role: "VOTER",
    },
  });

  const election = await prisma.election.create({
    data: {
      title: "Pemilihan Ketua 2026",
      description: "Pemilihan ketua organisasi tahun 2026",
    },
  });

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

  console.log({
    admin,
    andi,
    budi,
    citra,
    election,
    ahmad,
    budiCandidate,
    citraCandidate,
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
