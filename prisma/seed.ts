import { PrismaClient, SkillCategory, SkillLevel } from '@prisma/client';

const prisma = new PrismaClient();

const skills = [
  // DOMESTIC_CARE
  { code: 'CAREGIVING_ELDERLY', name: 'Perawatan Lansia', nameEn: 'Elderly Care', category: SkillCategory.DOMESTIC_CARE, description: 'Perawatan harian, mobilisasi, higiene personal lansia', icon: '👵' },
  { code: 'DEMENTIA_CARE', name: 'Perawatan Demensia', nameEn: 'Dementia Care', category: SkillCategory.DOMESTIC_CARE, description: 'Penanganan lansia dengan demensia/Alzheimer', icon: '🧠' },
  { code: 'CHILDCARE', name: 'Perawatan Anak', nameEn: 'Childcare', category: SkillCategory.DOMESTIC_CARE, description: 'Perawatan bayi & anak, stimulasi perkembangan', icon: '👶' },
  { code: 'DISABILITY_CARE', name: 'Perawatan Disabilitas', nameEn: 'Disability Care', category: SkillCategory.DOMESTIC_CARE, description: 'Dukungan aktivitas harian penyandang disabilitas', icon: '♿' },
  { code: 'FIRST_AID_CPR', name: 'First Aid & CPR', nameEn: 'First Aid & CPR', category: SkillCategory.DOMESTIC_CARE, description: 'Penanganan darurat medis dasar & resusitasi', icon: '🚑' },

  // CONSTRUCTION
  { code: 'WELDING_MIG', name: 'Las MIG/TIG', nameEn: 'MIG/TIG Welding', category: SkillCategory.CONSTRUCTION, description: 'Pengelasan logam dengan teknik MIG/TIG', icon: '🔥' },
  { code: 'CONCRETE_WORK', name: 'Pengecoran & Beton', nameEn: 'Concrete Work', category: SkillCategory.CONSTRUCTION, description: 'Pengecoran struktur, finishing beton', icon: '🏗️' },
  { code: 'PIPE_FITTING', name: 'Pemasangan Pipa', nameEn: 'Pipe Fitting', category: SkillCategory.CONSTRUCTION, description: 'Pemasangan sistem pipa air, gas, AC', icon: '🔧' },
  { code: 'TILING', name: 'Pemasangan Keramik', nameEn: 'Tiling', category: SkillCategory.CONSTRUCTION, description: 'Pemasangan keramik/granit lantai & dinding', icon: '🧱' },
  { code: 'PAINTING', name: 'Cat & Finishing', nameEn: 'Painting & Finishing', category: SkillCategory.CONSTRUCTION, description: 'Pengecatan interior/eksterior, finishing kayu', icon: '🎨' },
  { code: 'SCAFFOLDING', name: 'Perancahan (Scaffolding)', nameEn: 'Scaffolding', category: SkillCategory.CONSTRUCTION, description: 'Pemasangan & pembongkaran perancahan kerja', icon: '⚙️' },

  // HOSPITALITY
  { code: 'HOUSEKEEPING', name: 'Housekeeping Hotel', nameEn: 'Hotel Housekeeping', category: SkillCategory.HOSPITALITY, description: 'Kebersihan kamar, public area, laundry hotel', icon: '🏨' },
  { code: 'FOOD_BEVERAGE', name: 'Food & Beverage Service', nameEn: 'F&B Service', category: SkillCategory.HOSPITALITY, description: 'Pelayanan resto/kafe, barista, bartender', icon: '☕' },
  { code: 'FRONT_OFFICE', name: 'Front Office/Reception', nameEn: 'Front Office', category: SkillCategory.HOSPITALITY, description: 'Check-in/out, reservasi, layanan tamu', icon: '👔' },
  { code: 'COOKING_ASIAN', name: 'Memasak Masakan Asia', nameEn: 'Asian Cooking', category: SkillCategory.HOSPITALITY, description: 'Memasak masakan Indonesia, Cina, Jepang, Korea', icon: '🍳' },
  { code: 'COOKING_WESTERN', name: 'Memasak Masakan Barat', nameEn: 'Western Cooking', category: SkillCategory.HOSPITALITY, description: 'Memasak masakan Eropa, Italia, Prancis', icon: '🍝' },

  // LANGUAGE
  { code: 'ENGLISH_B1', name: 'Bahasa Inggris B1', nameEn: 'English B1', category: SkillCategory.LANGUAGE, description: 'Bahasa Inggris level intermediate (B1 CEFR)', icon: '🇬🇧' },
  { code: 'ENGLISH_B2', name: 'Bahasa Inggris B2', nameEn: 'English B2', category: SkillCategory.LANGUAGE, description: 'Bahasa Inggris level upper intermediate (B2 CEFR)', icon: '🇬🇧' },
  { code: 'ENGLISH_C1', name: 'Bahasa Inggris C1', nameEn: 'English C1', category: SkillCategory.LANGUAGE, description: 'Bahasa Inggris level advanced (C1 CEFR)', icon: '🇬🇧' },
  { code: 'JAPANESE_N4', name: 'Bahasa Jepang N4', nameEn: 'Japanese N4', category: SkillCategory.LANGUAGE, description: 'Bahasa Jepang level N4 (JLPT)', icon: '🇯🇵' },
  { code: 'JAPANESE_N3', name: 'Bahasa Jepang N3', nameEn: 'Japanese N3', category: SkillCategory.LANGUAGE, description: 'Bahasa Jepang level N3 (JLPT)', icon: '🇯🇵' },
  { code: 'KOREAN_TOPIK2', name: 'Bahasa Korea TOPIK II', nameEn: 'Korean TOPIK II', category: SkillCategory.LANGUAGE, description: 'Bahasa Korea level TOPIK 2', icon: '🇰🇷' },
  { code: 'ARABIC_BASIC', name: 'Bahasa Arab Dasar', nameEn: 'Basic Arabic', category: SkillCategory.LANGUAGE, description: 'Bahasa Arab untuk komunikasi sehari-hari', icon: '🇸🇦' },
  { code: 'MANDARIN_HSK3', name: 'Bahasa Mandarin HSK 3', nameEn: 'Mandarin HSK 3', category: SkillCategory.LANGUAGE, description: 'Bahasa Mandarin level HSK 3', icon: '🇨🇳' },

  // DRIVING
  { code: 'DRIVING_SIM_A', name: 'SIM A (Motor)', nameEn: 'License A (Motorcycle)', category: SkillCategory.DRIVING, description: 'Surat Izin Mengemudi roda 2', icon: '🏍️' },
  { code: 'DRIVING_SIM_B1', name: 'SIM B1 (Mobil Pribadi)', nameEn: 'License B1 (Private Car)', category: SkillCategory.DRIVING, description: 'Surat Izin Mengemudi roda 4 pribadi', icon: '🚗' },
  { code: 'DRIVING_SIM_B2', name: 'SIM B2 (Mobil Umum)', nameEn: 'License B2 (Commercial Car)', category: SkillCategory.DRIVING, description: 'Surat Izin Mengemudi roda 4 umum', icon: '🚌' },
  { code: 'HEAVY_EQUIPMENT', name: 'Alat Berat (Ekskavator/Loader)', nameEn: 'Heavy Equipment', category: SkillCategory.DRIVING, description: 'Mengoperasikan ekskavator, loader, bulldozer', icon: '🚜' },

  // DIGITAL_BASIC
  { code: 'COMPUTER_BASIC', name: 'Komputer Dasar', nameEn: 'Basic Computer', category: SkillCategory.DIGITAL_BASIC, description: 'Windows, MS Office, email, browsing', icon: '💻' },
  { code: 'SMARTPHONE_APPS', name: 'Aplikasi Smartphone', nameEn: 'Smartphone Apps', category: SkillCategory.DIGITAL_BASIC, description: 'WhatsApp, Google Maps, banking apps, e-wallet', icon: '📱' },
  { code: 'DIGITAL_MARKETING', name: 'Digital Marketing Dasar', nameEn: 'Basic Digital Marketing', category: SkillCategory.DIGITAL_BASIC, description: 'Media sosial, content creation, iklan online', icon: '📈' },

  // FINANCIAL_LITERACY
  { code: 'BUDGETING', name: 'Perencanaan Anggaran', nameEn: 'Budgeting', category: SkillCategory.FINANCIAL_LITERACY, description: 'Mencatat pengeluaran, membuat budget bulanan', icon: '📊' },
  { code: 'SAVING_INVESTING', name: 'Menabung & Investasi', nameEn: 'Saving & Investing', category: SkillCategory.FINANCIAL_LITERACY, description: 'Reksa dana, emas, deposito, saham dasar', icon: '💰' },
  { code: 'INSURANCE_LITERACY', name: 'Literasi Asuransi', nameEn: 'Insurance Literacy', category: SkillCategory.FINANCIAL_LITERACY, description: 'Memahami asuransi jiwa, kesehatan, kecelakaan', icon: '🛡️' },
  { code: 'REMITTANCE_MGMT', name: 'Manajemen Remittance', nameEn: 'Remittance Management', category: SkillCategory.FINANCIAL_LITERACY, description: 'Transfer uang ke Indonesia, compare rates', icon: '💸' },

  // MIGRATION_RIGHTS
  { code: 'TKI_LAW', name: 'Hukum TKI (UU 18/2017)', nameEn: 'TKI Law', category: SkillCategory.MIGRATION_RIGHTS, description: 'Hak & kewajiban TKI, prosedur pengaduan', icon: '⚖️' },
  { code: 'CONTRACT_REVIEW', name: 'Review Kontrak Kerja', nameEn: 'Contract Review', category: SkillCategory.MIGRATION_RIGHTS, description: 'Memahami klausul kontrak, gaji, jam kerja', icon: '📄' },
  { code: 'BPJS_TK', name: 'BPJS Ketenagakerjaan', nameEn: 'BPJS Employment', category: SkillCategory.MIGRATION_RIGHTS, description: 'Jaminan hari tua, kecelakaan kerja, kematian', icon: '🏥' },
  { code: 'EMBASSY_CONTACT', name: 'Kontak KBRI/Konsulat', nameEn: 'Embassy Contacts', category: SkillCategory.MIGRATION_RIGHTS, description: 'Prosedur bantuan konsuler, pelaporuan kasus', icon: '🏛️' },

  // ENTREPRENEURSHIP
  { code: 'SMALL_BIZ_MGMT', name: 'Manajemen Usaha Kecil', nameEn: 'Small Business Mgmt', category: SkillCategory.ENTREPRENEURSHIP, description: 'Modal, bookkeeping, pemasaran, skala usaha', icon: '🏪' },
  { code: 'ONLINE_SELLING', name: 'Jualan Online', nameEn: 'Online Selling', category: SkillCategory.ENTREPRENEURSHIP, description: 'Tokopedia, Shopee, TikTok Shop, dropshipping', icon: '🛒' },
];

const assessments = [
  {
    skillCode: 'CAREGIVING_ELDERLY',
    title: 'Asesmen Perawatan Lansia Dasar',
    description: 'Tes kompetensi perawatan harian, mobilisasi, nutrisi, higiene lansia',
    durationMin: 30,
    passingScore: 70,
    questions: [
      { id: 'q1', type: 'multiple_choice', question: 'Posisi tidur yang benar untuk lansia dengan gangguan pernapasan adalah?', options: ['Supine', 'Fowler tinggi (45-60°)', 'Prone', 'Side-lying'], correctAnswer: 1, weight: 10 },
      { id: 'q2', type: 'multiple_choice', question: 'Frekuensi ganti posisi tidur lansia encok untuk mencegah decubitus?', options: ['Setiap 1 jam', 'Setiap 2 jam', 'Setiap 4 jam', 'Setiap 6 jam'], correctAnswer: 1, weight: 10 },
      { id: 'q3', type: 'true_false', question: 'Lansia dengan diabetes membutuhkan pemeriksaan kaki harian', options: ['Benar', 'Salah'], correctAnswer: 0, weight: 10 },
      { id: 'q4', type: 'multiple_choice', question: 'Cara mengangkat lansia dari tempat tidur ke kursi roda yang aman?', options: ['Tarik lengan', 'Gulingkan ke sisi, dorong pinggul, tarik ke depan', 'Angkat dari belakang', 'Seret dengan selimut'], correctAnswer: 1, weight: 15 },
      { id: 'q5', type: 'multiple_choice', question: 'Tanda-tanda dehidrasi pada lansia meliputi?', options: ['Kulit kering, mulut kering, urine gelap', 'Berkeringat banyak, urine jernih', 'Nafsu makan meningkat', 'Energi berlebih'], correctAnswer: 0, weight: 10 },
      { id: 'q6', type: 'scenario', question: 'Lansia tiba-tiba tersengal makan. Langkah pertama?', options: ['Tepuk punggung', 'Heimlich maneuver', 'Berikan air', 'Panggil dokter'], correctAnswer: 1, weight: 15 },
      { id: 'q7', type: 'multiple_choice', question: 'Suhu ruangan ideal untuk lansia?', options: ['18-20°C', '22-24°C', '26-28°C', '30-32°C'], correctAnswer: 1, weight: 5 },
      { id: 'q8', type: 'multiple_choice', question: 'Nutrisi penting untuk pencegahan osteoporosis lansia?', options: ['Vitamin C & Zinc', 'Kalsium & Vitamin D', 'Besi & Folat', 'Protein & Karbohidrat'], correctAnswer: 1, weight: 10 },
      { id: 'q9', type: 'true_false', question: 'Semua lansia memerlukan bantuan penuh dalam aktivitas harian', options: ['Benar', 'Salah'], correctAnswer: 1, weight: 5 },
      { id: 'q10', type: 'multiple_choice', question: 'Komunikasi efektif dengan lansia dementia?', options: ['Bicara cepat & keras', 'Kalimat pendek, kontak mata, sabar', 'Gunakan bahasa gaul', 'Hindari bicara'], correctAnswer: 1, weight: 10 },
    ],
  },
  {
    skillCode: 'ENGLISH_B1',
    title: 'Asesmen Bahasa Inggris Level B1',
    description: 'Tes kemampuan Bahasa Inggris level Intermediate (B1 CEFR)',
    durationMin: 45,
    passingScore: 70,
    questions: [
      { id: 'q1', type: 'multiple_choice', question: 'Choose the correct form: "If I ____ you, I would apply for that job."', options: ['am', 'was', 'were', 'will be'], correctAnswer: 2, weight: 10 },
      { id: 'q2', type: 'multiple_choice', question: 'Which sentence uses present perfect correctly?', options: ['I have worked here since 2020', 'I worked here since 2020', 'I am working here since 2020', 'I work here since 2020'], correctAnswer: 0, weight: 10 },
      { id: 'q3', type: 'fill_blank', question: 'Complete: "By the time you arrive, I ____ (finish) cooking."', options: ['will have finished', 'finished', 'finish', 'am finishing'], correctAnswer: 0, weight: 10 },
      { id: 'q4', type: 'multiple_choice', question: 'What does "give up" mean?', options: ['Start', 'Continue', 'Quit', 'Begin'], correctAnswer: 2, weight: 10 },
      { id: 'q5', type: 'listening', question: 'Listen to the audio. What time is the meeting?', options: ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'], correctAnswer: 1, weight: 15 },
      { id: 'q6', type: 'reading', question: 'Read the text. What is the main idea?', options: ['Job requirements', 'Company history', 'Salary benefits', 'Working hours'], correctAnswer: 0, weight: 15 },
      { id: 'q7', type: 'multiple_choice', question: 'Choose the correct preposition: "I am good ____ cooking."', options: ['in', 'on', 'at', 'for'], correctAnswer: 2, weight: 10 },
      { id: 'q8', type: 'writing', question: 'Write a short email (50-80 words) to your employer requesting 2 days leave.', options: [], correctAnswer: '', weight: 20 },
    ],
  },
  {
    skillCode: 'WELDING_MIG',
    title: 'Asesmen Las MIG/TIG',
    description: 'Tes teori & praktik pengelasan MIG/TIG',
    durationMin: 60,
    passingScore: 75,
    questions: [
      { id: 'q1', type: 'multiple_choice', question: 'Gas shielding yang umum untuk las MIG baja karbon?', options: ['Argon 100%', 'CO2 100%', 'Argon + CO2 (75/25)', 'Helium 100%'], correctAnswer: 2, weight: 15 },
      { id: 'q2', type: 'multiple_choice', question: 'Polaritas untuk las MIG?', options: ['DCEN (Straight)', 'DCEP (Reverse)', 'AC', 'AC/DC'], correctAnswer: 1, weight: 15 },
      { id: 'q3', type: 'multiple_choice', question: 'Cacat las "porosity" disebabkan oleh?', options: ['Arus terlalu tinggi', 'Kecepatan las terlalu cepat', 'Kontaminasi gas/permukaan', 'Elektroda basah'], correctAnswer: 2, weight: 15 },
      { id: 'q4', type: 'scenario', question: 'Las TIG aluminium, tungsten terkontaminasi. Apa yang dilakukan?', options: ['Lanjutkan las', 'Bersihkan/tajamkan tungsten', 'Ganti gas', 'Turunkan arus'], correctAnswer: 1, weight: 20 },
      { id: 'q5', type: 'multiple_choice', question: 'PPE wajib las MIG/TIG?', options: ['Helm las, sarung tangan, baju lengan panjang, kacamata', 'Cukup helm las', 'Sarung tangan saja', 'Masker KN95'], correctAnswer: 0, weight: 10 },
      { id: 'q6', type: 'multiple_choice', question: 'Persiapan joint las butt weld?', options: ['Bersihkan karat/oli, V-groove 60-70°', 'Langsung las', 'Cat joint dulu', 'Panaskan joint'], correctAnswer: 0, weight: 15 },
      { id: 'q7', type: 'true_false', question: 'Las TIG tidak memerlukan gas shielding', options: ['Benar', 'Salah'], correctAnswer: 1, weight: 10 },
    ],
  },
];

const migrationChecklists = {
  SGP: [
    { id: 'passport', title: 'Paspor', description: 'Masa berlaku minimal 18 bulan', required: true },
    { id: 'visa', title: 'Work Permit / S-Pass', description: 'Dikeluarkan oleh employer via MOM', required: true },
    { id: 'medical', title: 'Pemeriksaan Medis (FOMEMA)', description: 'Di klinik beracreditasi MOM', required: true },
    { id: 'contract', title: 'Kontrak Kerja', description: 'Ditetapkan employer & disetujui pekerja', required: true },
    { id: 'insurance', title: 'Asuransi Kecelakaan Kerja (WICA)', description: 'Wajib dibayar employer', required: true },
    { id: 'embassy_reg', title: 'Registrasi KBRI Singapura', description: 'Online via e-register KBRI', required: false },
    { id: 'bank_account', title: 'Rekening Bank Lokal', description: 'DBS, OCBC, UOB untuk gaji', required: false },
    { id: 'phone', title: 'Kartu SIM Singapura', description: 'Singtel, StarHub, M1', required: false },
    { id: 'emergency_contact', title: 'Kontak Darurat', description: 'KBRI, polisi, rumah sakit, teman dekat', required: true },
    { id: 'skills_cert', title: 'Sertifikat Skill', description: 'SkillMatch VC + sertifikat asal', required: false },
  ],
  MYS: [
    { id: 'passport', title: 'Paspor', description: 'Masa berlaku minimal 18 bulan', required: true },
    { id: 'visa', title: 'Visit Pass (Temporary Employment)', description: 'Dikeluarkan Immigration Malaysia', required: true },
    { id: 'medical', title: 'Pemeriksaan Medis (FOMEMA)', description: 'Di klinik panel FOMEMA', required: true },
    { id: 'contract', title: 'Kontrak Kerja', description: 'Bahasa Melayu/Inggris, jelas gaji & jam kerja', required: true },
    { id: 'insurance', title: 'SOCSO & EIS', description: 'Wajib didaftarkan employer', required: true },
    { id: 'embassy_reg', title: 'Registrasi KBRI Kuala Lumpur', description: 'Online via e-register', required: false },
    { id: 'bank_account', title: 'Rekening Bank Malaysia', description: 'Maybank, CIMB, Public Bank', required: false },
    { id: 'emergency_contact', title: 'Kontak Darurat', description: 'KBRI, polis, hospital, komunitas TKI', required: true },
  ],
  HKG: [
    { id: 'passport', title: 'Paspor', description: 'Masa berlaku minimal 12 bulan', required: true },
    { id: 'visa', title: 'Working Visa (DH)', description: 'Standard Employment Contract (ID407)', required: true },
    { id: 'medical', title: 'Pemeriksaan Medis', description: 'Di klinik yang ditunjuk Immigration HK', required: true },
    { id: 'contract', title: 'Kontrak Standar (ID407)', description: 'Wajib bahasa Inggris & China', required: true },
    { id: 'insurance', title: 'Employees Compensation Insurance', description: 'Wajib dibayar employer', required: true },
    { id: 'embassy_reg', title: 'Registrasi KBRI Hong Kong', description: 'Online via e-register', required: false },
    { id: 'bank_account', title: 'Rekening Bank HK', description: 'HSBC, Hang Seng, Bank of China', required: false },
    { id: 'emergency_contact', title: 'Kontak Darurat', description: 'KBRI, polis, NGO bantuan TKI', required: true },
  ],
  TWN: [
    { id: 'passport', title: 'Paspor', description: 'Masa berlaku minimal 12 bulan', required: true },
    { id: 'visa', title: 'Work Permit', description: 'Dikeluarkan MOL Taiwan', required: true },
    { id: 'medical', title: 'Pemeriksaan Medis', description: 'Di rumah sakit terdaftar MOL', required: true },
    { id: 'contract', title: 'Kontrak Kerja', description: 'Bahasa Mandarin/Indonesia', required: true },
    { id: 'insurance', title: 'Labor Insurance & NHI', description: 'Wajib didaftarkan employer', required: true },
    { id: 'embassy_reg', title: 'Registrasi KDEI Taipei', description: 'Kantor Dagang Ekonomi Indonesia', required: false },
    { id: 'bank_account', title: 'Rekening Bank Taiwan', description: 'Chunghwa Post, Taiwan Bank', required: false },
    { id: 'emergency_contact', title: 'Kontak Darurat', description: 'KDEI, polis, rumah sakit, komunitas', required: true },
  ],
  KOR: [
    { id: 'passport', title: 'Paspor', description: 'Masa berlaku minimal 12 bulan', required: true },
    { id: 'visa', title: 'E-9 / H-2 Visa', description: 'EPS-TOPIK & medical check', required: true },
    { id: 'medical', title: 'Pemeriksaan Medis EPS', description: 'Di klinik K-Medical panel', required: true },
    { id: 'contract', title: 'Standard Employment Contract', description: 'Bahasa Korea/Indonesia', required: true },
    { id: 'insurance', title: 'Industrial Accident Insurance', description: 'Wajib employer', required: true },
    { id: 'embassy_reg', title: 'Registrasi KBRI Seoul', description: 'Online e-register', required: false },
    { id: 'bank_account', title: 'Rekening Bank Korea', description: 'KB Kookmin, Shinhan, Woori', required: false },
    { id: 'emergency_contact', title: 'Kontak Darurat', description: 'KBRI, HRD Korea, NGO migran', required: true },
  ],
  JPN: [
    { id: 'passport', title: 'Paspor', description: 'Masa berlaku minimal 12 bulan', required: true },
    { id: 'visa', title: 'Specified Skilled Worker (SSW)', description: 'Skill test + JLPT N4', required: true },
    { id: 'medical', title: 'Pemeriksaan Medis', description: 'Di rumah sakit yang ditunjuk', required: true },
    { id: 'contract', title: 'Kontrak Kerja', description: 'Bahasa Jepang/Indonesia', required: true },
    { id: 'insurance', title: 'Social Insurance (Shakai Hoken)', description: 'Kesehatan & pensiun', required: true },
    { id: 'embassy_reg', title: 'Registrasi KBRI Tokyo', description: 'Online e-register', required: false },
    { id: 'bank_account', title: 'Rekening Bank Jepang', description: 'Japan Post, MUFG, SMBC', required: false },
    { id: 'emergency_contact', title: 'Kontak Darurat', description: 'KBRI, polis, immigration, JITCO', required: true },
  ],
  SAU: [
    { id: 'passport', title: 'Paspor', description: 'Masa berlaku minimal 24 bulan', required: true },
    { id: 'visa', title: 'Work Visa (Iqama)', description: 'Dikeluarkan sponsor/kafeel', required: true },
    { id: 'medical', title: 'Pemeriksaan Medis GAMCA', description: 'Di klinik GAMCA terdaftar', required: true },
    { id: 'contract', title: 'Kontrak Kerja', description: 'Bahasa Arab/Inggris, disahkan KBRI', required: true },
    { id: 'insurance', title: 'Medical Insurance (Saudi Council)', description: 'Wajib sponsor', required: true },
    { id: 'embassy_reg', title: 'Registrasi KBRI Riyadh/Jeddah', description: 'Online e-register', required: false },
    { id: 'bank_account', title: 'Rekening Bank Saudi', description: 'Al Rajhi, SNB, Riyad Bank', required: false },
    { id: 'emergency_contact', title: 'Kontak Darurat', description: 'KBRI, polis, MOL, komunitas TKI', required: true },
  ],
  ARE: [
    { id: 'passport', title: 'Paspor', description: 'Masa berlaku minimal 12 bulan', required: true },
    { id: 'visa', title: 'Employment Visa / Labour Card', description: 'Dikeluarkan MOHRE via employer', required: true },
    { id: 'medical', title: 'Pemeriksaan Medis', description: 'Di klinik DHA/MOH terdaftar', required: true },
    { id: 'contract', title: 'Kontrak Kerja (MOHRE)', description: 'Bahasa Arab/Inggris, sistem MOHRE', required: true },
    { id: 'insurance', title: 'Health Insurance (Daman/Thiqa)', description: 'Wajib employer', required: true },
    { id: 'embassy_reg', title: 'Registrasi KBRI Abu Dhabi/Dubai', description: 'Online e-register', required: false },
    { id: 'bank_account', title: 'Rekening Bank UAE', description: 'Emirates NBD, ADCB, FA', required: false },
    { id: 'emergency_contact', title: 'Kontak Darurat', description: 'KBRI, polis, MOHRE, komunitas', required: true },
  ],
};

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Skills
  console.log('📚 Seeding skills...');
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { code: skill.code },
      update: skill,
      create: skill,
    });
  }
  console.log(`✅ ${skills.length} skills seeded`);

  // Seed Assessments
  console.log('📝 Seeding assessments...');
  for (const assessment of assessments) {
    const skill = await prisma.skill.findUnique({ where: { code: assessment.skillCode } });
    if (!skill) continue;

    await prisma.assessment.upsert({
      where: { id: `assessment-${assessment.skillCode.toLowerCase()}` },
      update: {
        skillId: skill.id,
        title: assessment.title,
        description: assessment.description,
        durationMin: assessment.durationMin,
        passingScore: assessment.passingScore,
        questions: assessment.questions,
      },
      create: {
        id: `assessment-${assessment.skillCode.toLowerCase()}`,
        skillId: skill.id,
        title: assessment.title,
        description: assessment.description,
        durationMin: assessment.durationMin,
        passingScore: assessment.passingScore,
        questions: assessment.questions,
      },
    });
  }
  console.log(`✅ ${assessments.length} assessments seeded`);

  // Note: Migration checklists are created per-user when they select a target country
  console.log('🌍 Migration checklists configured (created per-user)');

  console.log('🎉 Database seed completed!');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });