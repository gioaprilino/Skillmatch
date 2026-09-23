'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  Award, 
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  PlayCircle,
  FileText,
  Layers,
  X,
  Sparkles,
  CheckSquare,
  HelpCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { cn, getSkillCategoryLabel } from '@/lib/utils';

export interface AssessmentItem {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  passingScore: number;
  skill: { 
    id: string; 
    code: string; 
    name: string; 
    category: string; 
    icon?: string | null;
  };
  userAttempt: { 
    score: number; 
    passed: boolean; 
    completedAt: string;
  } | null;
}

export interface SyllabusLesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz';
  duration: string;
  summary: string;
  steps: string[];
  dos: string[];
  donts: string[];
  checklist: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  duration: string;
  lessonsCount: number;
  description: string;
  skills: string[];
  syllabus: SyllabusLesson[];
  targetAssessmentTitle: string;
  targetAssessmentId: string;
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    title: 'SOP Caregiving Terampil & Penanganan Lansia Demensia',
    category: 'DOMESTIC_CARE',
    categoryLabel: 'Perawatan Domestik',
    duration: '6 Jam Pembelajaran',
    lessonsCount: 5,
    description: 'Panduan standar internasional merawat lansia tirah baring, teknik transfer kursi roda ergonomis, penanganan demensia tanpa kekerasan, dan pencatatan tanda vital harian.',
    skills: ['Tanda Vital', 'Mobility Assistance', 'Nutrisi Lansia', 'First Aid'],
    targetAssessmentTitle: 'Asesmen Perawatan Lansia Dasar',
    targetAssessmentId: 'assessment-caregiving_elderly',
    syllabus: [
      {
        id: 'c1',
        title: 'SOP Pengukuran Tanda Vital & Deteksi Dini Hipotensi',
        type: 'video',
        duration: '15 mnt',
        summary: 'Prosedur standar pengukuran tekanan darah, frekuensi nadi, pernapasan, dan suhu tubuh pada lansia tirah baring untuk deteksi dini hipotensi ortostatik.',
        steps: [
          'Cuci tangan 6 langkah standar WHO dan kenakan sarung tangan medis bersih.',
          'Jelaskan prosedur pada lansia secara perlahan, pastikan pasien istirahat tenang minimal 5 menit.',
          'Pasang manset tensimeter 2-3 cm di atas lekukan siku, sejajar posisi jantung pasien.',
          'Lakukan pengukuran tensi darah, hitung denyut nadi radialis selama 60 detik penuh.',
          'Catat hasil pada formulir pemantauan harian dan laporkan segera jika sistolik < 90 mmHg.'
        ],
        dos: ['Pastikan manset pas (bisa diselip 2 jari)', 'Catat jam pengukuran dengan teliti'],
        donts: ['Jangan ukur tensi saat lansia baru selesai mandi air panas atau gelisah'],
        checklist: ['Manset sejajar jantung', 'Pasien rileks 5 menit', 'Pencatatan akurat di logbook']
      },
      {
        id: 'c2',
        title: 'Teknik Ergonomis Memindahkan Pasien ke Kursi Roda',
        type: 'video',
        duration: '20 mnt',
        summary: 'Panduan memindahkan lansia tirah baring ke kursi roda dengan teknik tumpuan paha (body mechanics) untuk mencegah cedera saraf dan punggung perawat.',
        steps: [
          'Posisikan kursi roda pada sudut 45 derajat ke sisi ranjang yang sehat/kuat dan kunci kedua remnya.',
          'Bantu lansia duduk di tepi tempat tidur secara bertahap, pasang alas kaki anti-selip.',
          'Buka kaki perawat selebar bahu, tekuk lutut, dan peluk pinggang lansia dengan tumpuan paha.',
          'Putar badan secara harmonis bersamaan ke arah kursi roda tanpa memutar tulang belakang.',
          'Turunkan pasien secara perlahan ke bantalan kursi roda dan pasang footrest dengan aman.'
        ],
        dos: ['Kunci rem kursi roda sebelum memindahkan pasien', 'Gunakan kekuatan otot paha, bukan pinggang'],
        donts: ['Dilarang menarik ketiak atau tangan pasien karena berisiko dislokasi sendi bahu'],
        checklist: ['Rem kursi roda terkunci', 'Footrest dinaikkan saat transfer', 'Punggung perawat lurus']
      },
      {
        id: 'c3',
        title: 'Pemberian Makanan Lewat NGT & Diet Rendah Garam',
        type: 'reading',
        duration: '25 mnt',
        summary: 'Standar enteral feeding melalui pipa lambung (Nasogastric Tube) dan pencegahan pneumonia aspirasi pada lansia berisiko disfagia.',
        steps: [
          'Posisikan tempat tidur semi-fowler atau tegak (30-45 derajat) sebelum pemberian nutrisi.',
          'Lakukan aspirasi spuit untuk memastikan selang berada di lambung dan periksa cairan residu.',
          'Bilas selang dengan 20-30 ml air hangat matang sebelum nutrisi cair dialirkan.',
          'Alirkan susu/formula secara perlahan dengan gaya gravitasi tanpa didorong paksa.',
          'Pertahankan lansia dalam posisi duduk minimal 30 menit setelah selesai makan.'
        ],
        dos: ['Periksa suhu formula makanan (hangat kuku)', 'Bilas pipa dengan air matang setelah makan'],
        donts: ['Dilarang membaringkan lansia datar segera setelah makan (memicu muntah & tersedak)'],
        checklist: ['Posisi semi-fowler 30-45°', 'Uji residu lambung dilakukan', 'Bilas air matang sesudah makan']
      },
      {
        id: 'c4',
        title: 'Komunikasi Efektif dengan Pasien Penurunan Daya Ingat (Demensia)',
        type: 'reading',
        duration: '30 mnt',
        summary: 'Metode pendekatan psikososial tanpa kekerasan (Gentle Care) untuk menenangkan lansia demensia saat gelisah (sundowning).',
        steps: [
          'Dekati lansia dari arah depan dengan kontak mata setinggi pandangan pasien.',
          'Gunakan kalimat pendek, positif, jelas, dan hindari kalimat berbelit-belit.',
          'Berikan satu instruksi sederhana dalam satu waktu dan beri jeda 10 detik untuk merespons.',
          'Lakukan validasi emosi tanpa mendebat kenyataan yang dialami pasien (redirection technique).'
        ],
        dos: ['Pertahankan senyuman dan nada bicara ramah', 'Arahkan perhatian ke aktivitas menyenangkan'],
        donts: ['Dilarang mendebat halusinasi atau memarahi lansia yang lupa ingatan'],
        checklist: ['Kontak mata sejajar', 'Instruksi satu per satu', 'Validasi dan pengalihan positif']
      },
      {
        id: 'c5',
        title: 'Simulasi Tanggap Darurat Tersedak (Heimlich Maneuver)',
        type: 'quiz',
        duration: '15 mnt',
        summary: 'Tindakan cepat penyelamatan nyawa saat lansia mengalami sumbatan jalan napas total saat makan.',
        steps: [
          'Kenali tanda tersedak total: pasien memegang leher, tidak bisa batuk atau berbicara.',
          'Posisikan diri di belakang pasien, condongkan tubuhnya ke depan dan beri 5 tepukan punggung.',
          'Lingkarkan tangan di perut atas (antara pusar dan tulang rusuk bawah).',
          'Lakukan hentakan cepat ke dalam dan ke atas (abdominal thrust) sampai sumbatan keluar.',
          'Segera panggil bantuan darurat/ambulans jika pasien tidak sadarkan diri.'
        ],
        dos: ['Lakukan hentakan tegas dan terarah', 'Periksa rongga mulut jika benda asing terlihat'],
        donts: ['Dilarang memberi air minum pada orang yang tersedak total'],
        checklist: ['Deteksi tanda universal tersedak', 'Tepukan punggung 5x', 'Hentakan perut ke dalam-atas']
      },
    ],
  },
  {
    id: 'mod-2',
    title: 'Standar Sanitasi & Housekeeping Hotel Bintang 5',
    category: 'HOSPITALITY',
    categoryLabel: 'Hospitality',
    duration: '4 Jam Pembelajaran',
    lessonsCount: 4,
    description: 'Kurikulum standar perhotelan internasional di Singapura & Malaysia: sanitasi kamar, penataan bed making berstandar 15 menit, dan penanganan bahan kimia pembersih (MSDS).',
    skills: ['Bed Making', 'Sanitasi Kamar Mandi', 'Chemical Safety', 'Etika Tamu'],
    targetAssessmentTitle: 'Asesmen Housekeeping Hotel Standar Internasional',
    targetAssessmentId: 'assessment-housekeeping',
    syllabus: [
      {
        id: 'h1',
        title: 'Prosedur Room Makeup & Penataan Sprei Standar Bintang 5',
        type: 'video',
        duration: '15 mnt',
        summary: 'Teknik Bed Making 15 menit standar hotel bintang 5 dengan metode Hospital Corner 45 derajat dan ketegangan sprei drum-tight test.',
        steps: [
          'Ketuk pintu kamar 3 kali sambil mengucap "Housekeeping, selamat pagi", tunggu 5 detik.',
          'Buka tirai jendela untuk pencahayaan alami dan ventilasi sirkulasi udara kamar.',
          'Lepas linen kotor (stripping) satu per satu dan periksa noda; jangan pernah meletakkan linen di lantai.',
          'Tebarkan bottom sheet, kunci sudut-sudut kasur dengan lipatan Hospital Corner 45° yang kencang.',
          'Masukkan duvet inner ke dalam duvet cover, ratakan keempat sudut, dan rapikan pillow case menghadap ke dalam.',
          'Lakukan uji drum-tight: permukaan sprei harus tegang mulus tanpa kerutan.'
        ],
        dos: ['Buat sudut lipatan 45° presisi', 'Bukaan sarung bantal menghadap ke arah dalam ranjang'],
        donts: ['Dilarang keras meletakkan sprei bersih atau kotor di atas karpet lantai'],
        checklist: ['Hospital Corner 45° di 4 sisi', 'Permukaan sprei drum-tight', 'Bantal rapi & simetris']
      },
      {
        id: 'h2',
        title: 'Kode Warna Kain Lap Mikrofiber & Pencegahan Kontaminasi Silang',
        type: 'reading',
        duration: '20 mnt',
        summary: 'Penerapan standar zonasi 4 warna kain lap mikrofiber internasional untuk mencegah transfer bakteri patogen antar area kamar.',
        steps: [
          'Kain MERAH: Khusus untuk kloset (toilet bowl), urinal, dan area berisiko kuman tinja tertinggi.',
          'Kain KUNING: Khusus untuk wastafel, dinding shower, bathtub, dan perlengkapan kamar mandi.',
          'Kain BIRU: Khusus untuk kaca cermin, jendela, dan permukaan kaca agar bebas goresan (streak-free).',
          'Kain HIJAU: Khusus untuk furnitur kamar tidur, meja kerja, minibar, dan area umum kamar tamu.',
          'Lipat kain menjadi 8 sisi kerja bersih, ganti sisi ketika berpindah ke perabot berikutnya.'
        ],
        dos: ['Gunakan selalu lap merah khusus kloset', 'Cuci kain lap secara terpisah per kelompok warna'],
        donts: ['Dilarang memakai kain lap toilet untuk membersihkan cermin atau meja kamar tidur'],
        checklist: ['Merah = Kloset', 'Kuning = Kamar Mandi', 'Biru = Kaca', 'Hijau = Kamar Tidur']
      },
      {
        id: 'h3',
        title: 'Penggunaan Bahan Kimia Pembersih Sesuai Lembar MSDS',
        type: 'reading',
        duration: '25 mnt',
        summary: 'Pedoman keselamatan penggunaan cairan pembersih MPC, Glass Cleaner, Descaler asam, dan Disinfektan sesuai standar K3 internasional.',
        steps: [
          'Kenakan APD wajib: sarung tangan nitril karet, kacamata pelindung (goggles), dan masker.',
          'Periksa label botol semprot (MPC = Multi-Purpose, Acid Bowl Cleaner = Kerak Kloset).',
          'Semprotkan bahan kimia ke kain lap mikrofiber terlebih dahulu, BUKAN langsung ke perabot kayu/elektronik.',
          'Biarkan cairan bekerja (contact time) selama 3-5 menit agar kuman mati sempurna sebelum dibilas.',
          'Pastikan exhaust fan kamar mandi menyala selama proses pembersihan kimia.'
        ],
        dos: ['Pastikan sirkulasi udara baik', 'Patuhi waktu kontak (contact time) cairan kimia'],
        donts: ['DILARANG KERAS mencampur cairan pemutih (klorin) dengan pembersih asam (menghasilkan gas beracun mematikan)'],
        checklist: ['Sarung tangan & masker terpasang', 'Chemical disemprot ke lap', 'Exhaust fan menyala']
      },
      {
        id: 'h4',
        title: 'Etika Privasi Tamu & Pelaporan Barang Tertinggal (Lost & Found)',
        type: 'quiz',
        duration: '15 mnt',
        summary: 'Prosedur integritas perhotelan dalam menangani barang berharga tamu yang tertinggal dan penanganan kamar DND (Do Not Disturb).',
        steps: [
          'Jika kamar bertanda "DND" (Do Not Disturb), jangan mengetuk atau membuka kamar; catat di lembar kerja.',
          'Jika menemukan barang tertinggal tamu saat check-out, ambil foto barang di lokasi penemuan.',
          'Segera hubungi Housekeeping Supervisor atau Security dalam waktu maksimal 15 menit.',
          'Catat di buku log Lost & Found: nomor kamar, tanggal, jam, detail barang, dan nama penemu.',
          'Simpan barang dalam seal bag bersegel resmi dan serahkan ke bagian penyimpanan berizin.'
        ],
        dos: ['Laporkan segala temuan barang sekecil apa pun dengan jujur', 'Segel barang berharga dalam kantong resmi'],
        donts: ['Dilarang keras menyimpan barang temuan di saku pribadi atau di dalam trolley kamar'],
        checklist: ['Hormati tanda DND', 'Lapor supervisor < 15 menit', 'Pencatatan buku log lengkap']
      },
    ],
  },
  {
    id: 'mod-3',
    title: 'K3 Manufaktur Industri & Budaya Kerja Pabrik (5S)',
    category: 'MANUFACTURING',
    categoryLabel: 'Manufaktur & Pabrik',
    duration: '5 Jam Pembelajaran',
    lessonsCount: 4,
    description: 'Persiapan kerja manufaktur di Jepang (SSW) dan Korea Selatan: budaya 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke), APD industri, dan prosedur darurat LOTO.',
    skills: ['Budaya 5S', 'Alat Pelindung Diri (APD)', 'Lockout/Tagout (LOTO)', 'K3 Industri'],
    targetAssessmentTitle: 'Asesmen Operator Mesin CNC & Presisi',
    targetAssessmentId: 'assessment-cnc_operator',
    syllabus: [
      {
        id: 'm1',
        title: 'Penerapan Konsep 5S di Jalur Perakitan Industri Modern',
        type: 'video',
        duration: '20 mnt',
        summary: 'Penerapan metodologi 5S Jepang (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) untuk keselamatan dan efisiensi lini produksi pabrik.',
        steps: [
          'Seiri (Ringkas): Pisahkan barang yang diperlukan dan singkirkan barang yang tidak terpakai dari area kerja.',
          'Seiton (Rapi): Beri label dan tentukan tempat tetap untuk setiap alat kerja (Shadow Board).',
          'Seiso (Resik): Bersihkan mesin, lantai, dan peralatan kerja setiap akhir shift produksi.',
          'Seiketsu (Rawat): Pertahankan standar kebersihan dan keteraturan dengan checklist harian.',
          'Shitsuke (Rajin): Biasakan disiplin mematuhi SOP keselamatan tanpa perlu diawasi.'
        ],
        dos: ['Kembalikan alat pada tempatnya segera setelah digunakan', 'Patuhi jalur batas aman (safety lines)'],
        donts: ['Dilarang menaruh benda yang menghalangi jalur evakuasi atau panel listrik'],
        checklist: ['Area kerja bebas tumpukan barang tak terpakai', 'Peralatan berlabel jelas', 'Pembersihan akhir shift']
      },
      {
        id: 'm2',
        title: 'Standar Kelayakan Alat Pelindung Diri (APD) di Area Bising & Debu',
        type: 'reading',
        duration: '20 mnt',
        summary: 'Pemeriksaan standar APD industri: helm keselamatan, safety shoes ujung baja, ear muff/plug, dan kacamata anti-pecah.',
        steps: [
          'Periksa helm keselamatan (hard hat): pastikan tali dagu terpasang kencang dan tidak retak.',
          'Gunakan safety shoes bersertifikasi dengan pelindung jari baja (steel toe) dan sol anti-paku.',
          'Gunakan ear plug atau ear muff di area dengan tingkat kebisingan > 85 desibel (dB).',
          'Kenakan kacamata safety anti-benturan saat melakukan gerinda, bubut, atau pemotongan logam.'
        ],
        dos: ['Ganti APD yang sudah aus atau rusak', 'Pasang ear plug dengan cara memilin rapat sebelum masuk telinga'],
        donts: ['Dilarang mengoperasikan mesin pabrik tanpa APD lengkap'],
        checklist: ['Helm terikat rapi', 'Sepatu safety baja', 'Ear protection aktif', 'Kacamata terpasang']
      },
      {
        id: 'm3',
        title: 'Prosedur Lockout/Tagout (LOTO) Saat Mesin Diperbaiki',
        type: 'video',
        duration: '25 mnt',
        summary: 'Protokol keselamatan penguncian sumber energi mesin berbahaya sebelum pemeliharaan atau pembersihan.',
        steps: [
          'Beri tahu operator sekitar bahwa mesin akan dimatikan untuk perbaikan.',
          'Matikan sakelar daya utama mesin (isolasi sumber listrik/pneumatik).',
          'Pasang gembok keselamatan pribadi (Padlock) pada sakelar pemutus energi.',
          'Pasang kartu peringatan (Tag) yang mencantumkan nama petugas, tanggal, dan alasan penguncian.',
          'Uji coba sakelar mesin untuk memastikan energi tersisa benar-benar nol (zero energy state).'
        ],
        dos: ['Kunci sakelar dengan gembok pribadi yang hanya dipegang oleh teknisi terkait'],
        donts: ['Dilarang membuka kunci LOTO milik rekan kerja tanpa izin resmi pengawas'],
        checklist: ['Daya listrik terputus', 'Gembok fisik terpasang', 'Kartu tag tertulis jelas', 'Uji zero energy']
      },
      {
        id: 'm4',
        title: 'Evakuasi Kebakaran & Jalur Aman di Fasilitas Manufaktur',
        type: 'quiz',
        duration: '15 mnt',
        summary: 'Prosedur evakuasi darurat, penggunaan APAR metode PASS, dan titik kumpul (assembly point).',
        steps: [
          'Saat mendengar alarm kebakaran, segera hentikan mesin dan tinggalkan area kerja dengan tenang.',
          'Gunakan APAR untuk api kecil dengan metode PASS (Pull pin, Aim nozzle, Squeeze handle, Sweep side-to-side).',
          'Berjalan cepat melalui jalur evakuasi hijau dan hindari menggunakan lift.',
          'Berkumpul di titik kumpul (Assembly Point) dan laporkan diri ke koordinator keselamatan (Floor Warden).'
        ],
        dos: ['Jalan cepat dan tetap tenang', 'Tutup pintu ruangan yang ditinggalkan untuk menghambat api'],
        donts: ['Dilarang kembali ke dalam gedung untuk mengambil barang pribadi'],
        checklist: ['Hafal jalur evakuasi terdekat', 'Metode PASS APAR dipahami', 'Titik kumpul diketahui']
      },
    ],
  },
  {
    id: 'mod-4',
    title: 'Bahasa Komunikasi Kerja Luar Negeri (Mandarin & Jepang)',
    category: 'LANGUAGE',
    categoryLabel: 'Bahasa Asing',
    duration: '8 Jam Pembelajaran',
    lessonsCount: 4,
    description: 'Kosakata wajib sehari-hari dengan majikan dan pengawas kerja: istilah medis, perintah kerja, meminta bantuan darurat, dan percakapan sopan di tempat kerja.',
    skills: ['Mandarin Kerja', 'Jepang Tokutei Ginou', 'Frasa Medis', 'Percakapan Sopan'],
    targetAssessmentTitle: 'Asesmen Bahasa Inggris Level B1',
    targetAssessmentId: 'assessment-english_b1',
    syllabus: [
      {
        id: 'l1',
        title: '50 Frasa Mandarin Esensial untuk Pekerja Caregiver Taiwan',
        type: 'video',
        duration: '30 mnt',
        summary: 'Pengucapan dan intonasi frasa dasar sehari-hari untuk mendampingi lansia di rumah sakit dan panti jompo Taiwan.',
        steps: [
          'Salam & Sapaan: Zao an (Selamat pagi), Nin hao (Halo/Apa kabar), Xie xie (Terima kasih).',
          'Kondisi Fisik: Ni na li bu shu fu? (Di mana yang terasa sakit?), Chi yao (Minum obat), He shui (Minum air).',
          'Aktivitas Harian: Qi chuang (Bangun tidur), Xi zao (Mandi), Qu ce suo (Pergi ke toilet).',
          'Konfirmasi Perintah: Wo zhi dao le (Saya mengerti), Hao de (Baiklah/Siap).'
        ],
        dos: ['Lafalkan nada intonasi dengan jelas', 'Gunakan bahasa tubuh yang sopan dan ramah'],
        donts: ['Jangan menjawab "ya/paham" jika sebenarnya belum mengerti maksud instruksi majikan'],
        checklist: ['Lafal sapaan tepat', 'Pertanyaan kondisi fisik dikuasai', 'Konfirmasi perintah dipahami']
      },
      {
        id: 'l2',
        title: 'Kosakata Perintah Kerja & Nama Peralatan Rumah Tangga / Pabrik',
        type: 'reading',
        duration: '25 mnt',
        summary: 'Daftar istilah operasional peralatan kerja, tombol mesin, dan perkakas pembersih dalam bahasa asing.',
        steps: [
          'Tombol Operasional: Kai guan (Sakelar On/Off), Ting zhi (Berhenti/Stop), Wei xian (Bahaya).',
          'Peralatan Rumah: Xi yi ji (Mesin cuci), Xi chen qi (Vacuum cleaner), Sao ba (Sapu), Tuo ba (Pel).',
          'Perintah Tugas: Ba zhe ge qing jie gan jing (Tolong bersihkan ini sampai bersih), Xiao xin (Hati-hati).'
        ],
        dos: ['Buat catatan saku kecil untuk kosakata baru yang sering dipakai majikan'],
        donts: ['Dilarang memencet tombol mesin jika belum membaca petunjuk bahasanya'],
        checklist: ['Istilah tombol darurat dihafal', 'Nama perkakas utama dikuasai']
      },
      {
        id: 'l3',
        title: 'Frasa Darurat Meminta Tolong, Polisi, dan Ambulans',
        type: 'video',
        duration: '20 mnt',
        summary: 'Komunikasi cepat saat keadaan darurat medis, kebakaran, atau ancaman keselamatan jiwa.',
        steps: [
          'Seruan Tolong: Jiu ming a! (Tolong/Save me!), You ren shou shang le (Ada orang terluka!).',
          'Panggilan Darurat: Bao jing (Panggil polisi - 110), Jiao jiu hu che (Panggil ambulans - 119).',
          'Menyebutkan Lokasi: Wo de di zhi shi... (Alamat saya ada di...).'
        ],
        dos: ['Catat nomor darurat dan alamat tempat tinggal di dekat telepon rumah'],
        donts: ['Jangan panik saat menelepon operator darurat, sebutkan alamat dengan tenang'],
        checklist: ['Hafal nomor 110 & 119', 'Mampu menyebut alamat tempat tinggal', 'Frasa tolong dikuasai']
      },
      {
        id: 'l4',
        title: 'Simulasi Wawancara Kerja dengan User / Agensi Asing',
        type: 'quiz',
        duration: '25 mnt',
        summary: 'Latihan menjawab pertanyaan wawancara rekrutmen majikan asing: perkenalan diri, pengalaman kerja, dan motivasi.',
        steps: [
          'Perkenalan Diri (Jikoshoukai / Zi wo jie shao): Nama, usia, asal daerah, dan pengalaman kerja.',
          'Kesiapan Kerja: Kesiapan bekerja lembur, rajin, disiplin, dan menghormati aturan keluarga/pabrik.',
          'Sikap Wawancara: Duduk tegak, tatap mata pewawancara, tersenyum ramah, dan ucapkan terima kasih di akhir sesi.'
        ],
        dos: ['Berikan jawaban singkat, padat, dan jujur', 'Ucapkan salam hormat di awal dan akhir'],
        donts: ['Dilarang menunduk atau memainkan tangan saat wawancara berlangsung'],
        checklist: ['Perkenalan diri lancar', 'Kontak mata percaya diri', 'Etika sopan santun']
      },
    ],
  },
  {
    id: 'mod-5',
    title: 'Literasi Keuangan, Remittance Legal, & Hukum PMI',
    category: 'FINANCIAL_LITERACY',
    categoryLabel: 'Literasi Finansial',
    duration: '3 Jam Pembelajaran',
    lessonsCount: 4,
    description: 'Kunci sukses finansial purna-migrasi: rumus alokasi gaji 40/35/25, menghindari calo kiriman uang ilegal, memahami hak paspor dan perjanjian kerja resmi BP2MI.',
    skills: ['Remittance Legal', 'Rumus 40/35/25', 'Hak Perjanjian Kerja', 'Anti-Investasi Bodong'],
    targetAssessmentTitle: 'Asesmen Literasi Keuangan & Perencanaan Anggaran',
    targetAssessmentId: 'assessment-budgeting',
    syllabus: [
      {
        id: 'f1',
        title: 'Menghitung Selisih Kurs & Biaya Kirim Uang (Fintech vs Bank)',
        type: 'video',
        duration: '15 mnt',
        summary: 'Cara cerdas memilih jalur pengiriman uang (remittance) resmi berizin Bank Indonesia dengan nilai kurs terbaik dan biaya flat hemat.',
        steps: [
          'Bandingkan kurs tukar real-time antar aplikasi resmi berizin (jangan hanya melihat biaya admin murah).',
          'Pastikan penyedia jasa memiliki lisensi resmi Penyelenggara Transfer Dana dari otoritas negara asal & BI.',
          'Simpan bukti transfer resmi (nomor referensi transaksi) sampai uang terkonfirmasi masuk ke rekening keluarga di Indonesia.',
          'Hindari jasa perorangan jalur gelap/bawah tanah (hawala) yang melanggar hukum dan berisiko uang hilang.'
        ],
        dos: ['Kirim uang melalui kanal legal resmi berizin', 'Cek nama rekening penerima sebelum kirim'],
        donts: ['Dilarang mentransfer uang melalui calo perorangan tanpa izin resmi'],
        checklist: ['Lisensi transfer resmi dicek', 'Kurs & biaya dihitung cermat', 'Bukti transfer tersimpan']
      },
      {
        id: 'f2',
        title: 'Disiplin Menabung 25% untuk Modal Usaha Purna PMI',
        type: 'reading',
        duration: '20 mnt',
        summary: 'Penerapan rumus keuangan SkillMatch 40/35/25 agar hasil kerja keras di luar negeri menjadi aset produktif berkelanjutan.',
        steps: [
          'Alokasi 40%: Remittance untuk nafkah keluarga inti di tanah air (kebutuhan pokok, sekolah anak).',
          'Alokasi 35%: Biaya hidup mandiri di negara penempatan (makan, pulsa, transport, tabungan darurat).',
          'Alokasi 25%: Tabungan terkunci khusus modal usaha mandiri di rekening bank pribadi pekerja sendiri.',
          'Buka rekening tabungan berjangka atau deposito yang tidak dapat ditarik sewaktu-waktu.'
        ],
        dos: ['Miliki rekening bank pribadi terpisah di Indonesia atas nama pekerja sendiri'],
        donts: ['Dilarang menghabiskan seluruh gaji untuk gaya hidup konsumtif atau pinjaman keluarga tanpa batas'],
        checklist: ['Rumus 40/35/25 diterapkan', 'Rekening modal usaha mandiri aktif', 'Disiplin alokasi bulanan']
      },
      {
        id: 'f3',
        title: 'Hak Hukum atas Paspor Pribadi & Saluran Pengaduan KBRI',
        type: 'reading',
        duration: '25 mnt',
        summary: 'Perlindungan hukum pekerja migran Indonesia: hak memegang dokumen identitas asli dan prosedur kontak perwakilan RI.',
        steps: [
          'Berdasarkan hukum internasional dan UU Perlindungan PMI, paspor adalah dokumen milik negara dan hak pribadi pekerja.',
          'Majikan atau agensi tidak berhak menyita paspor tanpa izin tertulis yang sah.',
          'Simpan fotokopi paspor, visa kerja, dan kontrak kerja resmi di tempat aman serta cadangan foto di HP.',
          'Simpan nomor hotline 24 jam KBRI/KJRI setempat untuk pelaporan kondisi darurat atau pelanggaran kontrak.'
        ],
        dos: ['Simpan salinan digital kontrak kerja dan visa di cloud/email', 'Ketahui nomor hotline KBRI'],
        donts: ['Dilarang menandatangani surat pernyataan penyerahan paspor tanpa memahami konsekuensi hukumnya'],
        checklist: ['Hak paspor dipahami', 'Kontrak kerja tersimpan rapi', 'Kontak darurat KBRI tersimpan']
      },
      {
        id: 'f4',
        title: 'Mengenali Modus Penipuan Investasi & Pinjol Ilegal',
        type: 'quiz',
        duration: '15 mnt',
        summary: 'Edukasi proteksi aset pekerja migran dari jebakan investasi bodong berskema Ponzi dan jeratan pinjaman online ilegal.',
        steps: [
          'Kenali ciri utama investasi bodong: janji keuntungan tetap tinggi (> 5-10% per bulan) dengan klaim "tanpa risiko".',
          'Cek legalitas perusahaan di situs resmi Otoritas Jasa Keuangan (OJK) atau Bappebti sebelum menaruh uang.',
          'Jangan pernah memberikan data KTP, foto selfie, atau rekening bank kepada aplikasi pinjol tidak resmi.',
          'Konsultasikan rencana investasi keluarga dengan penasihat keuangan terpercaya.'
        ],
        dos: ['Gunakan prinsip 2L: Legal (ada izin) dan Logis (keuntungan masuk akal)'],
        donts: ['Dilarang tergiur ajakan arisan berantai atau titip dana yang tidak jelas badan hukumnya'],
        checklist: ['Prinsip 2L dipahami', 'Izin OJK diverifikasi', 'Data pribadi terlindungi']
      },
    ],
  },
];

const CATEGORIES = [
  { key: 'all', label: 'Semua Bidang' },
  { key: 'DOMESTIC_CARE', label: 'Perawatan Domestik' },
  { key: 'CONSTRUCTION', label: 'Konstruksi & Pengelasan' },
  { key: 'MANUFACTURING', label: 'Manufaktur & Mesin' },
  { key: 'HOSPITALITY', label: 'Hospitality & Hotel' },
  { key: 'MARITIME', label: 'Maritim & Pelaut' },
  { key: 'LANGUAGE', label: 'Bahasa Asing' },
  { key: 'DIGITAL_BASIC', label: 'Digital & Komputer' },
  { key: 'FINANCIAL_LITERACY', label: 'Literasi Keuangan' },
];

export default function AssessmentsListClient({
  initialAssessments,
}: {
  initialAssessments: AssessmentItem[];
}) {
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentItem[]>(initialAssessments);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assessments' | 'modules'>('assessments');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  const handleStartAssessment = (module: LearningModule) => {
    const target = assessments.find(
      (a) => a.id === module.targetAssessmentId || a.skill.category === module.category
    );
    setSelectedModule(null);
    setActiveLessonIndex(null);

    if (target) {
      if (target.userAttempt?.passed) {
        router.push(`/dashboard/upskilling/assessments/${target.id}/result`);
      } else {
        router.push(`/dashboard/upskilling/assessments/${target.id}/take`);
      }
    } else {
      setActiveTab('assessments');
      setFilterCategory(module.category);
      setSearchQuery('');
    }
  };

  const handleViewInList = (module: LearningModule) => {
    setSelectedModule(null);
    setActiveLessonIndex(null);
    setActiveTab('assessments');
    setFilterCategory(module.category);
    setSearchQuery('');
  };

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.set('category', filterCategory);
      const res = await fetch(`/api/assessments?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Gagal memuat daftar asesmen');
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setAssessments(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data asesmen');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = useMemo(() => {
    let result = assessments;
    if (filterCategory !== 'all') {
      result = result.filter((a) => a.skill.category === filterCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.skill.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [assessments, filterCategory, searchQuery]);

  const completedCount = useMemo(() => {
    return assessments.filter((a) => a.userAttempt?.passed).length;
  }, [assessments]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar Navigation */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard Utama
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAssessments}
              disabled={loading}
              className="gap-2 text-xs"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              Segarkan Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-6 sm:p-8">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sertifikasi Verifiable Credential W3C Terstandarisasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Asesmen Kompetensi & Upskilling
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Ikuti tes kompetensi standar industri untuk calon pekerja migran (PMI) dan tenaga kerja informal. 
              Hasil kelulusan akan langsung diterbitkan sebagai <strong>Sertifikat Digital Kriptografis (Verifiable Credential)</strong> yang dapat diverifikasi oleh agensi dan employer luar negeri.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Total Asesmen Tersedia</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{assessments.length} Modul</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Sertifikat Anda</p>
                <p className="text-xl font-bold text-primary mt-0.5">{completedCount} Terbit</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border col-span-2 sm:col-span-1">
                <p className="text-xs text-muted-foreground">Standar Verifikasi</p>
                <p className="text-xl font-bold text-emerald-500 mt-0.5">W3C & DID</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border gap-2">
          <button
            onClick={() => setActiveTab('assessments')}
            className={cn(
              'flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold border-b-2 transition-all',
              activeTab === 'assessments'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            Ujian Sertifikasi BNSP & W3C VC ({assessments.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={cn(
              'flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold border-b-2 transition-all',
              activeTab === 'modules'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="h-4 w-4" />
            Kurikulum & Modul Belajar (Micro-Learning)
            <Badge variant="outline" className="ml-1 text-[10px] bg-primary/10 text-primary border-primary/20">
              5 Sektor
            </Badge>
          </button>
        </div>

        {activeTab === 'assessments' ? (
          <>
            {/* Filter & Search Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari keahlian (contoh: Las, Caregiving, Bahasa, CNC)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card border-border"
                  />
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 self-end sm:self-center">
                  Menampilkan <span className="font-semibold text-foreground">{filteredAssessments.length}</span> dari {assessments.length} asesmen
                </div>
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setFilterCategory(cat.key)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
                      filterCategory === cat.key
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/60'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchAssessments}>
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* Assessments Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssessments.length === 0 ? (
                <div className="col-span-full text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/40">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-60" />
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    Tidak ada asesmen yang sesuai kriteria
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                      ? `Tidak ditemukan asesmen dengan kata kunci "${searchQuery}".`
                      : 'Belum ada asesmen untuk kategori ini.'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setFilterCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    Reset Semua Filter
                  </Button>
                </div>
              ) : (
                filteredAssessments.map((assessment) => (
                  <AssessmentCard key={assessment.id} assessment={assessment} />
                ))
              )}
            </div>
          </>
        ) : (
          /* Learning Modules (Micro-Learning) View */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Kurikulum Pembelajaran Vokasi Berbasis Standar Industri Luar Negeri
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pelajari panduan SOP dan materi micro-learning terlebih dahulu sebelum mengambil tes sertifikasi BNSP & Verifiable Credential.
                </p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary shrink-0 text-xs">
                Gratis untuk PMI
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {LEARNING_MODULES.map((module) => (
                <div
                  key={module.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-xs bg-muted/60">
                        {module.categoryLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {module.duration}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-foreground leading-snug">
                        {module.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                        {module.description}
                      </p>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {module.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-secondary text-[11px] font-medium text-secondary-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Syllabus snippet */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2">
                      <p className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                        <span>Silabus Ringkas:</span>
                        <span>{module.lessonsCount} Pelajaran</span>
                      </p>
                      <ul className="space-y-1.5 text-xs">
                        {module.syllabus.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            {item.type === 'video' ? (
                              <PlayCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            ) : item.type === 'reading' ? (
                              <FileText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <CheckSquare className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate flex-1 text-[11px]">{item.title}</span>
                            <span className="text-[10px] shrink-0">{item.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-5 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full text-xs gap-1.5 rounded-xl"
                      onClick={() => {
                        setSelectedModule(module);
                        setActiveLessonIndex(null);
                      }}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      Buka Panduan Materi SOP
                    </Button>
                    <Button
                      className="w-full text-xs gap-1.5 rounded-xl"
                      onClick={() => handleStartAssessment(module)}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Mulai Ujian Sertifikasi Terkait
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Module Detail & SOP Lesson Viewer Modal */}
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4 bg-muted/10">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {selectedModule.categoryLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {selectedModule.duration} • {selectedModule.lessonsCount} Pelajaran
                    </span>
                    {activeLessonIndex !== null && (
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Materi {activeLessonIndex + 1} dari {selectedModule.syllabus.length}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">
                    {selectedModule.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full shrink-0"
                  onClick={() => {
                    setSelectedModule(null);
                    setActiveLessonIndex(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
                {activeLessonIndex === null ? (
                  /* Syllabus List View */
                  <>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Ringkasan Kompetensi
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        {selectedModule.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Struktur Pelajaran & SOP Standar Industri
                        </h4>
                        <span className="text-[11px] font-medium text-primary">
                          Klik materi untuk membuka panduan lengkap
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {selectedModule.syllabus.map((item, idx) => {
                          const isDone = !!completedLessons[`${selectedModule.id}-${idx}`];
                          return (
                            <button
                              key={item.id || idx}
                              type="button"
                              onClick={() => setActiveLessonIndex(idx)}
                              className={cn(
                                'w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group cursor-pointer',
                                isDone
                                  ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                                  : 'border-border/80 bg-background/60 hover:border-primary/50 hover:bg-primary/5'
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs transition-colors',
                                    isDone
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                                  )}
                                >
                                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground capitalize flex items-center gap-2 mt-0.5">
                                    <span>
                                      {item.type === 'video'
                                        ? 'Video Demonstrasi SOP'
                                        : item.type === 'reading'
                                        ? 'Dokumen Prosedur & Cheklist'
                                        : 'Kuis Latihan Pemahaman'}
                                    </span>
                                    <span>•</span>
                                    <span>{item.duration}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {isDone && (
                                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                                    Selesai
                                  </Badge>
                                )}
                                <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                  Buka SOP <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <p className="text-xs font-medium">
                        ✓ Modul ini disesuaikan dengan Standar Kompetensi Kerja Nasional Indonesia (SKKNI) dan standar kerja resmi Kementerian Ketenagakerjaan negara penempatan.
                      </p>
                    </div>
                  </>
                ) : (
                  /* Detailed Lesson / SOP View */
                  (() => {
                    const currentLesson = selectedModule.syllabus[activeLessonIndex];
                    const lessonKey = `${selectedModule.id}-${activeLessonIndex}`;
                    const isLessonDone = !!completedLessons[lessonKey];

                    return (
                      <div className="space-y-5">
                        <button
                          type="button"
                          onClick={() => setActiveLessonIndex(null)}
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar Silabus Modul
                        </button>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="text-[10px]">
                                {currentLesson.type === 'video'
                                  ? 'Video Demonstrasi SOP'
                                  : currentLesson.type === 'reading'
                                  ? 'Dokumen SOP Resmi'
                                  : 'Latihan Pemahaman'}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {currentLesson.duration}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-foreground">
                              {currentLesson.title}
                            </h4>
                          </div>

                          <Button
                            variant={isLessonDone ? 'secondary' : 'default'}
                            size="sm"
                            className="text-xs gap-1.5 shrink-0 rounded-xl"
                            onClick={() => {
                              setCompletedLessons((prev) => {
                                const nextVal = !prev[lessonKey];
                                if (nextVal) {
                                  toast.success('Pelajaran berhasil diselesaikan!');
                                }
                                return { ...prev, [lessonKey]: nextVal };
                              });
                            }}
                          >
                            <CheckCircle2 className={cn('h-3.5 w-3.5', isLessonDone && 'text-emerald-500')} />
                            {isLessonDone ? 'Sudah Dipelajari' : 'Tandai Selesai'}
                          </Button>
                        </div>

                        {/* Media Mockup */}
                        {currentLesson.type === 'video' ? (
                          <div className="relative aspect-video rounded-xl bg-slate-900 border border-border flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden shadow-inner group">
                            <div className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                              <PlayCircle className="h-8 w-8" />
                            </div>
                            <p className="mt-3 text-xs font-semibold text-slate-200">
                              Simulasi Video SOP: {currentLesson.title}
                            </p>
                            <span className="text-[11px] text-slate-400 mt-0.5">
                              Audio & Subtitle: Bahasa Indonesia • Durasi {currentLesson.duration}
                            </span>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                              <FileText className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">
                                Lembar Panduan Kerja & Dokumen Cheklist
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Pelajari prosedur kerja berstandar internasional berikut dan pahami setiap poinnya sebelum asesmen.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Summary */}
                        <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1.5">
                          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Ringkasan Kompetensi Materi
                          </h5>
                          <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                            {currentLesson.summary}
                          </p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-2.5">
                          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Langkah Kerja & Standar Prosedur (SOP)
                          </h5>
                          <div className="space-y-2">
                            {currentLesson.steps.map((step, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-3 rounded-xl border border-border/70 bg-background flex items-start gap-3"
                              >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* DOs & DONTs */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4" /> Hal Wajib Dilakukan (DOs)
                            </span>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                              {currentLesson.dos.map((d, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 font-bold">•</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                              <X className="h-4 w-4" /> Larangan Kritis (DONTs)
                            </span>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                              {currentLesson.donts.map((d, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-1.5">
                                  <span className="text-rose-500 font-bold">•</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Checklist */}
                        <div className="p-4 rounded-xl border border-border bg-card space-y-2.5">
                          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                            <span>Cheklist Pemahaman Mandiri</span>
                            <span className="text-[11px] font-normal text-muted-foreground">Centang untuk evaluasi diri</span>
                          </h5>
                          <div className="space-y-2">
                            {currentLesson.checklist.map((chk, cIdx) => (
                              <label key={cIdx} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                  defaultChecked={isLessonDone}
                                />
                                <span>{chk}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Lesson Pagination */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-xl"
                            disabled={activeLessonIndex === 0}
                            onClick={() => setActiveLessonIndex(activeLessonIndex - 1)}
                          >
                            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Pelajaran Sebelumnya
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-xl"
                            disabled={activeLessonIndex === selectedModule.syllabus.length - 1}
                            onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                          >
                            Pelajaran Berikutnya <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border flex flex-col sm:flex-row gap-2 justify-end bg-muted/20">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedModule(null);
                    setActiveLessonIndex(null);
                  }}
                  className="rounded-xl text-xs"
                >
                  Tutup
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleViewInList(selectedModule)}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Search className="h-3.5 w-3.5" />
                  Lihat di Daftar Asesmen
                </Button>
                <Button
                  className="rounded-xl text-xs gap-1.5"
                  onClick={() => handleStartAssessment(selectedModule)}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Mulai Ujian Sertifikasi Terkait
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssessmentCard({ assessment }: { assessment: AssessmentItem }) {
  const { userAttempt, skill, passingScore, durationMin, title, description } = assessment;
  const isCompleted = !!userAttempt;
  const isPassed = userAttempt?.passed;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-2xl">
            {skill.icon ? (
              <span role="img" aria-label={skill.name}>{skill.icon}</span>
            ) : (
              <FileCheck2 className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
              {getSkillCategoryLabel(skill.category)}
            </span>
            <h3 className="mt-1 text-base font-bold text-foreground line-clamp-2 leading-snug">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
        {description}
      </p>

      {/* Meta Specs */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>Durasi: <strong className="text-foreground">{durationMin} Menit</strong></span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Award className="h-3.5 w-3.5 text-amber-500" />
          <span>Passing: <strong className="text-foreground">{passingScore}%</strong></span>
        </div>
      </div>

      {/* User Attempt Status Banner if taken */}
      {isCompleted && (
        <div className="mb-4 p-3 rounded-xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Status Pengerjaan</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px]',
                isPassed
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              )}
            >
              {isPassed ? (
                <>
                  <CheckCircle2 className="h-3 w-3" /> Lulus ({userAttempt?.score}%)
                </>
              ) : (
                <>Belum Lulus ({userAttempt?.score}%)</>
              )}
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isPassed ? 'bg-emerald-500' : 'bg-rose-500'
              )}
              style={{ width: `${Math.min(100, Math.max(5, userAttempt?.score || 0))}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-right">
            Diselesaikan: {new Date(userAttempt!.completedAt).toLocaleDateString('id-ID')}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-2 border-t border-border mt-auto">
        <Button asChild className="w-full gap-2 rounded-xl" variant={isCompleted && isPassed ? 'default' : 'default'}>
          <Link
            href={
              isCompleted
                ? `/dashboard/upskilling/assessments/${assessment.id}/result`
                : `/dashboard/upskilling/assessments/${assessment.id}/take`
            }
          >
            {isCompleted ? (
              <>
                <Award className="h-4 w-4" />
                Lihat Hasil & Sertifikat VC
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                Mulai Asesmen
                <ArrowRight className="h-4 w-4 ml-auto" />
              </>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
