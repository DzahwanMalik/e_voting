import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/utils/password";

async function main() {
  console.log("Starting database cleanup...");
  // Clean up existing data in reverse order of foreign key dependencies
  await prisma.vote.deleteMany();
  await prisma.electionVoter.deleteMany();
  await prisma.electionAdmin.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.election.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");
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

  // 3. Voters (Created by Super Admin / Admin)
  const andi = await prisma.user.create({
    data: {
      username: "andi",
      password: await hashPassword("andi123"),
      name: "Andi Saputra",
      role: "VOTER",
      createdById: admin.id,
    },
  });

  const budi = await prisma.user.create({
    data: {
      username: "budi",
      password: await hashPassword("budi123"),
      name: "Budi Santoso",
      role: "VOTER",
      createdById: admin.id,
    },
  });

  const citra = await prisma.user.create({
    data: {
      username: "citra",
      password: await hashPassword("citra123"),
      name: "Citra Wardani",
      role: "VOTER",
      createdById: superAdmin.id,
    },
  });

  console.log("Seeding Election 1: Pemilihan Ketua Organisasi Mahasiswa 2026...");
  // 4. Election 1 (Primary Election with 4 rich candidates)
  const election1 = await prisma.election.create({
    data: {
      title: "Pemilihan Ketua Organisasi 2026",
      description:
        "Pemilihan umum ketua dan formatur organisasi periode 2026/2027. Silakan pelajari profil, visi, dan misi setiap kandidat sebelum memberikan suara.",
    },
  });

  // Assign Admin to Election 1
  await prisma.electionAdmin.create({
    data: {
      electionId: election1.id,
      userId: admin.id,
    },
  });

  // Candidates for Election 1
  const candidate1 = await prisma.candidate.create({
    data: {
      electionId: election1.id,
      name: "Ahmad Fauzi, S.Kom.",
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      description:
        "Mahasiswa berprestasi bidang teknologi & kepemimpinan digital. Berpengalaman memimpin 10+ proyek kolaborasi kampus dan organisasi mahasiswa tingkat nasional.",
      birthday: new Date("2002-05-15"),
      vision:
        "Mewujudkan tata kelola organisasi yang transparan, adaptif, berbasis digital, dan inklusif demi tercapainya aspirasi seluruh anggota.",
      mission:
        "1. Mengembangkan platform digitalisasi layanan aspirasi dan transparansi anggaran organisasi secara terbuka.\n2. Mengadakan program akselerasi kompetensi teknologi dan kepemimpinan bersertifikasi bagi seluruh anggota.\n3. Memperluas jejaring kemitraan strategis dengan institusi industri nasional dan jejaring alumni global.\n4. Menyelenggarakan forum dengar pendapat dan evaluasi berkala secara demokratis dan partisipatif.",
    },
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      electionId: election1.id,
      name: "Budi Pratama, S.T.",
      photoUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      description:
        "Aktivis kampus dan inovator muda berfokus pada pengembangan riset, kewirausahaan sosial, dan kolaborasi multidisiplin ilmu.",
      birthday: new Date("2001-08-20"),
      vision:
        "Menjadikan organisasi sebagai wadah kolaborasi inovatif unggul yang berdaya saing global dan berdampak nyata bagi kesejahteraan masyarakat luas.",
      mission:
        "1. Memfasilitasi inkubasi karya riset dan rintisan usaha mahasiswa melalui program pendanaan mandiri.\n2. Membangun ruang kolaborasi lintas divisi guna mempercepat penyelesaian isu-isu strategis kampus.\n3. Menjalin kerja sama pengabdian masyarakat berbasis teknologi di wilayah 3T bersama lembaga nirlaba.\n4. Mengoptimalkan advokasi hak-hak akademik dan fasilitas pendukung prestasi seluruh anggota.",
    },
  });

  const candidate3 = await prisma.candidate.create({
    data: {
      electionId: election1.id,
      name: "Citra Lestari, S.Si.",
      photoUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      description:
        "Penggerak pemberdayaan pemuda, advokasi sains terbuka, dan pengabdian masyarakat. Delegasi Konferensi Pemimpin Muda Asia Pasifik 2025.",
      birthday: new Date("2003-01-10"),
      vision:
        "Membangun ekosistem kepemimpinan yang berempati, progresif, berintegritas tinggi, dan berkelanjutan bagi seluruh lapisan anggota.",
      mission:
        "1. Mengintegrasikan prinsip kesetaraan, keberagaman, dan inklusivitas dalam setiap program kerja organisasi.\n2. Meluncurkan program inkubator kepemimpinan pemuda dan jejaring mentorship karier profesional.\n3. Mendorong riset aksi sosial yang responsif terhadap permasalahan sosial dan lingkungan sekitar kampus.\n4. Meningkatkan transparansi monitoring dan evaluasi kinerja program organisasi melalui pelaporan berkala.",
    },
  });

  const candidate4 = await prisma.candidate.create({
    data: {
      electionId: election1.id,
      name: "Dian Paramita, S.E.",
      photoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      description:
        "Praktisi manajemen organisasi dan tata kelola keuangan nirlaba. Berpengalaman mengelola program sosial berdampak bagi ribuan penerima manfaat.",
      birthday: new Date("2002-11-28"),
      vision:
        "Menciptakan kepemimpinan akuntabel, profesional, berdaya guna, dan responsif terhadap dinamika tantangan zaman.",
      mission:
        "1. Menerapkan sistem pelaporan keuangan digital terintegrasi dan akuntabel yang dapat diaudit publik.\n2. Menyelenggarakan pelatihan tata kelola organisasi modern dan manajemen proyek berbasis standar industri.\n3. Membangun sinergi harmonis antara alumni, dosen, mahasiswa, dan pemangku kepentingan strategis.\n4. Memperkuat program pendampingan beasiswa dan bantuan sosial bagi anggota yang membutuhkan.",
    },
  });

  // Enroll Voters in Election 1
  await prisma.electionVoter.createMany({
    data: [
      {
        electionId: election1.id,
        userId: andi.id,
        hasVoted: false,
      },
      {
        electionId: election1.id,
        userId: budi.id,
        hasVoted: false,
      },
      {
        electionId: election1.id,
        userId: citra.id,
        hasVoted: false,
      },
    ],
  });

  console.log("Seeding Election 2: Pemilihan Dewan Pengawas Independen 2026...");
  // 5. Election 2 (Secondary Election to test election switching in frontend)
  const election2 = await prisma.election.create({
    data: {
      title: "Pemilihan Dewan Pengawas 2026",
      description:
        "Pemilihan dewan pengawas perwakilan mahasiswa untuk mengawal transparansi, kepatuhan kode etik, dan akuntabilitas lembaga.",
    },
  });

  // Assign Admin to Election 2
  await prisma.electionAdmin.create({
    data: {
      electionId: election2.id,
      userId: admin.id,
    },
  });

  // Candidates for Election 2
  const candidate5 = await prisma.candidate.create({
    data: {
      electionId: election2.id,
      name: "Farhan Mahendra, S.H.",
      photoUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      description:
        "Spesialis advokasi hukum organisasi dan kepatuhan kelembagaan. Mantan koordinator komisi hukum & perundangan mahasiswa.",
      birthday: new Date("2001-04-12"),
      vision:
        "Terwujudnya lembaga kemahasiswaan yang bersih, transparan, adil, dan berlandaskan prinsip tata kelola hukum yang baik.",
      mission:
        "1. Mengawasi realisasi dan alokasi anggaran belanja organisasi secara independen tanpa intervensi.\n2. Menyediakan saluran pengaduan dan whistleblowing yang aman, terpercaya, dan rahasia bagi seluruh anggota.",
    },
  });

  const candidate6 = await prisma.candidate.create({
    data: {
      electionId: election2.id,
      name: "Gita Nirmala, S.Sos.",
      photoUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      description:
        "Pengamat kebijakan publik kampus dan pegiat transparansi informasi. Aktif dalam advokasi hak-hak mahasiswa.",
      birthday: new Date("2002-09-18"),
      vision:
        "Menjamin akuntabilitas publik dan keberpihakan setiap kebijakan kelembagaan kepada kepentingan segenap mahasiswa.",
      mission:
        "1. Membuka akses publik terhadap risalah rapat pengawasan dan pelaporan kinerja setiap semester.\n2. Menyelenggarakan audit kinerja rutin dan audiensi terbuka bersama seluruh elemen organisasi.",
    },
  });

  // Enroll Voters in Election 2
  // Catatan: 'budi' sengaja HANYA didaftarkan pada Election 1 untuk menguji skenario 1 election (full width).
  // 'andi' dan 'citra' didaftarkan pada kedua pemilihan untuk menguji skenario multi-election (grid col 2).
  await prisma.electionVoter.createMany({
    data: [
      {
        electionId: election2.id,
        userId: andi.id,
        hasVoted: false,
      },
      {
        electionId: election2.id,
        userId: citra.id,
        hasVoted: false,
      },
    ],
  });

  console.log("\n========================================================");
  console.log("Seeding completed successfully!");
  console.log("========================================================");
  console.log("Credentials available for testing:");
  console.log("1. Super Admin                -> username: superadmin | password: superadmin123");
  console.log("2. Admin                      -> username: admin      | password: admin123");
  console.log("3. Voter 1 (Multi-Election 2) -> username: andi       | password: andi123");
  console.log("4. Voter 2 (Single-Election 1)-> username: budi       | password: budi123 (Hanya 1 Pemilihan -> Full Width)");
  console.log("5. Voter 3 (Multi-Election 2) -> username: citra      | password: citra123");
  console.log("--------------------------------------------------------");
  console.log("Elections seeded:");
  console.log(
    ` - [ID: ${election1.id}] ${election1.title} (${[candidate1.name, candidate2.name, candidate3.name, candidate4.name].length} candidates)`,
  );
  console.log(
    ` - [ID: ${election2.id}] ${election2.title} (${[candidate5.name, candidate6.name].length} candidates)`,
  );
  console.log("========================================================\n");
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
