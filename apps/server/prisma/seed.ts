import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/utils/password";

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
      password: await hashPassword("superadmin123"),
      name: "Super Administrator",
      role: "SUPER_ADMIN",
    },
  });

  // 2. Admin (Created by Super Admin)
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      password: await hashPassword("admin123"),
      name: "Administrator",
      role: "ADMIN",
      createdById: superAdmin.id,
    },
  });

  // 3. Voters (Created by Super Admin or Admin)
  const andi = await prisma.user.create({
    data: {
      username: "andi",
      password: await hashPassword("andi123"),
      name: "Andi",
      role: "VOTER",
      createdById: admin.id,
    },
  });

  const budi = await prisma.user.create({
    data: {
      username: "budi",
      password: await hashPassword("budi123"),
      name: "Budi",
      role: "VOTER",
      createdById: admin.id,
    },
  });

  const citra = await prisma.user.create({
    data: {
      username: "citra",
      password: await hashPassword("citra123"),
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
      photoUrl: "https://example.com/photos/ahmad.jpg",
      description: "Mahasiswa berprestasi bidang teknologi dan kepemimpinan",
      birthday: new Date("2002-05-15"),
      vision: "Mewujudkan organisasi yang transparan dan inovatif",
      mission: "Meningkatkan kolaborasi dan digitalisasi sistem",
      electionId: election.id,
    },
  });

  const budiCandidate = await prisma.candidate.create({
    data: {
      name: "Budi",
      photoUrl: "https://example.com/photos/budi.jpg",
      description: "Aktivis kampus berpengalaman dalam manajemen organisasi",
      birthday: new Date("2001-08-20"),
      vision: "Menjadikan organisasi unggul dan berdaya saing global",
      mission: "Mengembangkan potensi anggota melalui pelatihan berkala",
      electionId: election.id,
    },
  });

  const citraCandidate = await prisma.candidate.create({
    data: {
      name: "Citra",
      photoUrl: "https://example.com/photos/citra.jpg",
      description: "Penggerak kegiatan sosial dan pemberdayaan mahasiswa",
      birthday: new Date("2003-01-10"),
      vision: "Membangun lingkungan inklusif dan progresif",
      mission: "Mendorong partisipasi aktif seluruh anggota",
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
