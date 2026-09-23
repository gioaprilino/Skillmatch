import { PrismaClient, WorkType, ContractType, SalaryPeriod, JobStatus, SkillLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Job Posts...');

  const employer = await prisma.user.findFirst({
    where: { role: 'EMPLOYER' },
  });

  if (!employer) {
    throw new Error('Employer user not found. Run base seed first.');
  }

  const skills = await prisma.skill.findMany();
  const skillMap = new Map(skills.map((s) => [s.code, s.id]));

  const jobsData = [
    {
      id: 'job-caregiver-taiwan',
      title: 'Perawat Lansia Terampil (Caregiver) - Taipei',
      description: 'Dibutuhkan 20 perawat lansia untuk ditempatkan di panti rawat lansia dan rumah tangga modern di Taipei. Fasilitas asrama, makan, dan asuransi kesehatan NHI ditanggung penuh oleh yayasan.',
      country: 'TWN',
      province: 'Taipei City',
      city: 'Taipei',
      workType: WorkType.ONSITE,
      salaryMin: 22000,
      salaryMax: 26000,
      salaryCurrency: 'TWD',
      salaryPeriod: SalaryPeriod.MONTHLY,
      contractType: ContractType.FIXED_TERM,
      contractDurationMonths: 36,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      requirements: [
        'Memiliki sertifikat kompetensi Perawatan Lansia / Caregiving',
        'Mampu komunikasi dasar Mandarin atau Bahasa Inggris',
        'Usia 21 - 40 tahun, sehat jasmani dan rohani',
        'Lulus pemeriksaan medis GAMCA / MOL Taiwan'
      ],
      responsibilities: [
        'Membantu aktivitas harian lansia (makan, mobilisasi, kebersihan diri)',
        'Mencatat tanda-tanda vital harian (tensi, gula darah sederhana)',
        'Mendampingi jadwal terapi fisik ringan dan kontrol dokter'
      ],
      benefits: [
        'Tempat tinggal (asrama) dan konsumsi harian',
        'Asuransi Tenaga Kerja dan Asuransi Kesehatan Nasional (NHI)',
        'Tiket pesawat PP Indonesia - Taiwan setelah kontrak selesai',
        'Bonus tahunan dan uang lembur sesuai regulasi MOL Taiwan'
      ],
      skills: [
        { code: 'CAREGIVING_ELDERLY', level: SkillLevel.INTERMEDIATE, mandatory: true, weight: 100 },
        { code: 'FIRST_AID_CPR', level: SkillLevel.BEGINNER, mandatory: false, weight: 70 },
      ]
    },
    {
      id: 'job-welder-japan',
      title: 'Tukang Las Konstruksi & Pabrikasi (MIG/TIG) - SSW Tokutei Ginou',
      description: 'Program visa Keahlian Khusus (SSW 1) di Osaka Heavy Industries. Mengerjakan pengelasan rangka baja struktur bangunan tahan gempa dan komponen alat berat.',
      country: 'JPN',
      province: 'Kansai',
      city: 'Osaka',
      workType: WorkType.ONSITE,
      salaryMin: 230000,
      salaryMax: 280000,
      salaryCurrency: 'JPY',
      salaryPeriod: SalaryPeriod.MONTHLY,
      contractType: ContractType.FIXED_TERM,
      contractDurationMonths: 36,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      requirements: [
        'Lulus uji keterampilan SSW Konstruksi atau Las MIG/TIG',
        'Lulus tes kemampuan Bahasa Jepang JLPT N4 atau JFT-Basic A2',
        'Pengalaman pengelasan minimal 1 tahun diutamakan'
      ],
      responsibilities: [
        'Melakukan pengelasan struktur pelat dan pipa baja sesuai cetak biru teknik',
        'Memeriksa hasil las dengan visual test dan toleransi presisi standar JIS',
        'Menerapkan budaya keselamatan kerja 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke)'
      ],
      benefits: [
        'Gaji standar tenaga kerja lokal Jepang + asuransi Shakai Hoken',
        'Tunjangan lembur dan tunjangan shift malam',
        'Peluang perpanjangan visa hingga SSW 2 (dapat membawa keluarga)',
        'Subsidi biaya sewa apartemen'
      ],
      skills: [
        { code: 'WELDING_MIG', level: SkillLevel.INTERMEDIATE, mandatory: true, weight: 100 },
        { code: 'JAPANESE_N4', level: SkillLevel.BEGINNER, mandatory: false, weight: 80 },
      ]
    },
    {
      id: 'job-cnc-korea',
      title: 'Operator Mesin Bubut & Milling CNC - Incheon',
      description: 'Penempatan pabrik manufaktur suku cadang otomotif di Kawasan Industri Incheon. Mengoperasikan mesin CNC presisi tinggi dengan sistem kontrol Fanuc / Siemens.',
      country: 'KOR',
      province: 'Gyeonggi',
      city: 'Incheon',
      workType: WorkType.ONSITE,
      salaryMin: 2450000,
      salaryMax: 2900000,
      salaryCurrency: 'KRW',
      salaryPeriod: SalaryPeriod.MONTHLY,
      contractType: ContractType.FIXED_TERM,
      contractDurationMonths: 36,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      requirements: [
        'Memahami dasar G-Code/M-Code dan alat ukur mikrometer / vernier caliper',
        'Lulus sertifikasi kompetensi mesin atau SMK Teknik Mesin',
        'Dasar Bahasa Korea TOPIK 1 atau EPS-TOPIK merupakan nilai tambah'
      ],
      responsibilities: [
        'Setting benda kerja dan mata pahat pada mesin CNC milling / lathe',
        'Menjalankan program pemotongan dan inspeksi dimensi suku cadang',
        'Melakukan perawatan harian mesin pelumasan dan cairan pendingin (coolant)'
      ],
      benefits: [
        'Upah minimum resmi Korea + uang lembur 1.5x lipat',
        'Asuransi kecelakaan kerja dan asuransi kepulangan (Departure Guarantee)',
        'Makan siang dan fasilitas mes pabrik',
        'Hak cuti tahunan dan uang pesangon akhir kontrak'
      ],
      skills: [
        { code: 'CNC_OPERATOR', level: SkillLevel.INTERMEDIATE, mandatory: true, weight: 100 },
        { code: 'QUALITY_CONTROL', level: SkillLevel.BEGINNER, mandatory: false, weight: 70 },
      ]
    },
    {
      id: 'job-housekeeping-singapore',
      title: 'Staf Housekeeping & Sanitasi Hotel Bintang 5 - Marina Bay',
      description: 'Peluang berkarir di sektor perhotelan internasional Singapura. Bertanggung jawab atas standar kebersihan kamar tamu kelas dunia, penataan amenities, dan kepuasan tamu.',
      country: 'SGP',
      province: 'Central Region',
      city: 'Singapore',
      workType: WorkType.ONSITE,
      salaryMin: 1800,
      salaryMax: 2300,
      salaryCurrency: 'SGD',
      salaryPeriod: SalaryPeriod.MONTHLY,
      contractType: ContractType.FIXED_TERM,
      contractDurationMonths: 24,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      requirements: [
        'Kemampuan komunikasi Bahasa Inggris sehari-hari (Level B1)',
        'Pengalaman di bidang housekeeping hotel atau lulusan perhotelan',
        'Cekatan, teliti, dan memiliki etika pelayanan ramah'
      ],
      responsibilities: [
        'Membersihkan dan merapikan kamar tamu sesuai SOP luxury hotel',
        'Mengganti linen, handuk, dan melengkapi perlengkapan mandi tamu',
        'Melaporkan barang temuan (lost and found) dan perbaikan fasilitas'
      ],
      benefits: [
        'Work Permit resmi Singapura yang disponsori penuh hotel',
        'Makan bertugas (duty meal) di restoran staf',
        'Seragam kerja dan binatu seragam disediakan',
        'Asuransi medis dan bonus performa kuartalan'
      ],
      skills: [
        { code: 'HOUSEKEEPING', level: SkillLevel.INTERMEDIATE, mandatory: true, weight: 100 },
        { code: 'ENGLISH_B1', level: SkillLevel.INTERMEDIATE, mandatory: true, weight: 90 },
      ]
    },
    {
      id: 'job-seaman-taiwan',
      title: 'Awak Kapal Penangkap Ikan Samudera (BST STCW) - Kaohsiung',
      description: 'Penempatan armada kapal penangkap ikan laut dalam pelabuhan Kaohsiung. Mengoperasikan jaring tangkap, penanganan cold storage hasil tangkapan, dan navigasi dasar.',
      country: 'TWN',
      province: 'Kaohsiung City',
      city: 'Kaohsiung',
      workType: WorkType.ONSITE,
      salaryMin: 24000,
      salaryMax: 28000,
      salaryCurrency: 'TWD',
      salaryPeriod: SalaryPeriod.MONTHLY,
      contractType: ContractType.FIXED_TERM,
      contractDurationMonths: 24,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      requirements: [
        'Wajib memiliki Buku Pelaut (Seaman Book) dan sertifikat BST STCW',
        'Bebas dari mabuk laut kronis dan memiliki fisik prima',
        'Lolos tes kesehatan pelaut dan tes mata'
      ],
      responsibilities: [
        'Operasional penurunan dan penarikan alat tangkap ikan tuna/cumi',
        'Pemilahan, pembersihan, dan pembekuan ikan di ruang cold storage kapal',
        'Melaksanakan tugas jaga (watchkeeping) dan latihan keselamatan laut rutin'
      ],
      benefits: [
        'Akomodasi dan ransum makan penuh di atas kapal',
        'Bonus tonase hasil tangkapan ikan',
        'Asuransi kecelakaan laut internasional',
        'Penyaluran remitansi gaji langsung ke rekening keluarga di Indonesia'
      ],
      skills: [
        { code: 'SEAMAN_BASIC', level: SkillLevel.ADVANCED, mandatory: true, weight: 100 },
        { code: 'FISH_PROCESSING', level: SkillLevel.BEGINNER, mandatory: false, weight: 70 },
      ]
    },
    {
      id: 'job-admin-malaysia',
      title: 'Staf Administrasi Gudang & Data Entry Digital - Kuala Lumpur',
      description: 'Perusahaan pusat logistik e-commerce terkemuka di Klang Valley mencari staf administrasi data entry untuk menginput manifes barang, resi pengiriman, dan stok inventaris.',
      country: 'MYS',
      province: 'Selangor',
      city: 'Kuala Lumpur / Klang',
      workType: WorkType.ONSITE,
      salaryMin: 2200,
      salaryMax: 2800,
      salaryCurrency: 'MYR',
      salaryPeriod: SalaryPeriod.MONTHLY,
      contractType: ContractType.FIXED_TERM,
      contractDurationMonths: 24,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      requirements: [
        'Terampil menggunakan komputer, Microsoft Excel / Google Sheets, dan email',
        'Mampu mengetik cepat dengan akurasi data minimal 95%',
        'Memahami dasar Bahasa Melayu dan Bahasa Inggris sederhana'
      ],
      responsibilities: [
        'Mencatat barcode barang masuk dan keluar gudang ke sistem WMS',
        'Mencetak surat jalan kirim dan label paket ekspedisi',
        'Melakukan rekonsiliasi data inventaris mingguan'
      ],
      benefits: [
        'Visa kerja resmi Employment Pass / Levi ditanggung perusahaan',
        'Mes karyawan ber-AC dekat lokasi stasiun LRT',
        'Klaim pengobatan rawat jalan dan rawat inap',
        'Insentif produktivitas bulanan'
      ],
      skills: [
        { code: 'COMPUTER_BASIC', level: SkillLevel.INTERMEDIATE, mandatory: true, weight: 100 },
        { code: 'ENGLISH_B1', level: SkillLevel.BEGINNER, mandatory: false, weight: 70 },
        { code: 'BUDGETING', level: SkillLevel.BEGINNER, mandatory: false, weight: 50 },
      ]
    },
    {
      id: 'job-spa-dubai',
      title: 'Terapis Spa & Wellness Profesional - Dubai Luxury Resort',
      description: 'Resor bintang lima terkemuka di Dubai, Uni Emirat Arab merekrut terapis spa Indonesia berpengalaman untuk perawatan body massage, reflexology, dan aromatherapy.',
      country: 'ARE',
      province: 'Dubai Emirate',
      city: 'Dubai',
      workType: WorkType.ONSITE,
      salaryMin: 3500,
      salaryMax: 4500,
      salaryCurrency: 'AED',
      salaryPeriod: SalaryPeriod.MONTHLY,
      contractType: ContractType.FIXED_TERM,
      contractDurationMonths: 24,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      requirements: [
        'Sertifikat keahlian pijat tradisional / Spa Therapist berstandar BNSP',
        'Komunikasi Bahasa Inggris lancar untuk interaksi dengan tamu mancanegara',
        'Penampilan bersih, rapi, dan bersikap ramah profesional'
      ],
      responsibilities: [
        'Melayani treatment spa relaksasi tamu hotel sesuai menu wellness',
        'Mempersiapkan ruangan, minyak esensial, dan higienitas alat spa',
        'Memberikan konsultasi ramah terkait kebutuhan perawatan relaksasi tamu'
      ],
      benefits: [
        'Gaji pokok bebas pajak (tax-free) + tip tamu yang melimpah',
        'Akomodasi apartemen staf, transportasi jemputan, dan asuransi medis DHA',
        'Tiket pesawat PP Indonesia - Dubai setiap cuti tahunan',
        'Pelatihan berkala standar hotel bintang lima internasional'
      ],
      skills: [
        { code: 'SPA_MASSAGE', level: SkillLevel.ADVANCED, mandatory: true, weight: 100 },
        { code: 'ENGLISH_B1', level: SkillLevel.INTERMEDIATE, mandatory: true, weight: 80 },
      ]
    },
    {
      id: 'job-palm-oil-malaysia',
      title: 'Mandor & Operator Panen Kelapa Sawit Modern - Johor',
      description: 'Perkebunan kelapa sawit bersertifikasi RSPO di Johor Bahru membutuhkan tenaga kerja terampil untuk pemanenan buah sawit TBS, pemangkasan dahan, dan supervisi lapangan.',
      country: 'MYS',
      province: 'Johor',
      city: 'Johor Bahru',
      workType: WorkType.ONSITE,
      salaryMin: 2000,
      salaryMax: 2600,
      salaryCurrency: 'MYR',
      salaryPeriod: SalaryPeriod.MONTHLY,
      contractType: ContractType.FIXED_TERM,
      contractDurationMonths: 24,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      requirements: [
        'Fisik kuat dan terbiasa bekerja di area perkebunan',
        'Memahami kriteria kematangan buah sawit siap panen',
        'Pengalaman kerja di perkebunan sawit menjadi nilai tambah utama'
      ],
      responsibilities: [
        'Memotong tandan buah segar (TBS) sawit dengan dodos / egrek sesuai standar',
        'Menyusun buah sawit di tempat pengumpulan hasil (TPH) untuk diangkut truk',
        'Menjaga keselamatan kerja perkebunan (K3) dan penggunaan APD lengkap'
      ],
      benefits: [
        'Gaji pokok + premi panen borongan yang dapat meningkatkan penghasilan',
        'Rumah dinas perkebunan, listrik, dan air bersih disediakan gratis',
        'Jaminan perlindungan BPJS Ketenagakerjaan & SOCSO Malaysia',
        'Fasilitas klinik kesehatan perkebunan'
      ],
      skills: [
        { code: 'PALM_OIL_HARVEST', level: SkillLevel.INTERMEDIATE, mandatory: true, weight: 100 },
      ]
    }
  ];

  for (const job of jobsData) {
    const { skills: jobSkillsData, ...jobDetails } = job;

    const jobPost = await prisma.jobPost.upsert({
      where: { id: job.id },
      update: {
        ...jobDetails,
        employerId: employer.id,
      },
      create: {
        ...jobDetails,
        employerId: employer.id,
      },
    });

    // Delete existing job skills and re-link
    await prisma.jobSkill.deleteMany({ where: { jobId: jobPost.id } });

    for (const js of jobSkillsData) {
      const skillId = skillMap.get(js.code);
      if (skillId) {
        await prisma.jobSkill.create({
          data: {
            jobId: jobPost.id,
            skillId,
            level: js.level,
            mandatory: js.mandatory,
            weight: js.weight,
          },
        });
      }
    }
    console.log(`✅ Seeded job: ${jobPost.title}`);
  }

  console.log('🎉 Successfully seeded 8 overseas job posts!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding jobs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
