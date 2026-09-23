'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  CheckCircle2,
  Circle,
  AlertTriangle,
  FileText,
  PhoneCall,
  ShieldCheck,
  Building2,
  ExternalLink,
  Printer,
  ChevronRight,
  Info,
  Calendar,
  Lock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  docType?: string;
  notes?: string;
}

interface CountryData {
  code: string;
  name: string;
  flag: string;
  currency: string;
  embassy: {
    name: string;
    address: string;
    phone: string;
    hotline: string;
    portalUrl: string;
  };
  keyNotes: string;
  items: ChecklistItem[];
}

const COUNTRIES: CountryData[] = [
  {
    code: 'SGP',
    name: 'Singapura',
    flag: '🇸🇬',
    currency: 'SGD',
    embassy: {
      name: 'KBRI Singapura',
      address: '7 Chatsworth Road, Singapore 249761',
      phone: '+65 6737 7422',
      hotline: '+65 9295 3964 (Emergency 24 Jam)',
      portalUrl: 'https://kemlu.go.id/singapore'
    },
    keyNotes: 'Pemberi kerja wajib menanggung asuransi WICA dan biaya penerbitan Work Permit melalui MOM.',
    items: [
      { id: 'passport', title: 'Paspor RI Asli', description: 'Masa berlaku paspor minimal 18 bulan sebelum keberangkatan', required: true, docType: 'Identitas' },
      { id: 'visa', title: 'In-Principle Approval (IPA) / Work Permit', description: 'Surat persetujuan resmi dari Ministry of Manpower (MOM) Singapura', required: true, docType: 'Izin Kerja' },
      { id: 'medical', title: 'Pemeriksaan Medis (FOMEMA / Klinik Akreditasi MOM)', description: 'Pemeriksaan bebas TBC, HIV, sifilis, kehamilan, dan tes fisik umum', required: true, docType: 'Kesehatan' },
      { id: 'contract', title: 'Kontrak Kerja Standar', description: 'Memuat rincian gaji pokok, jam kerja, hari libur, dan fasilitas akomodasi', required: true, docType: 'Legal' },
      { id: 'insurance', title: 'Asuransi Kecelakaan Kerja (WICA)', description: 'Work Injury Compensation Act wajib disediakan penuh oleh employer', required: true, docType: 'Perlindungan' },
      { id: 'embassy_reg', title: 'Registrasi Online Lapor Diri Peduli WNI (KBRI)', description: 'Pendaftaran perlindungan WNI melalui portal kemlu.go.id', required: false, docType: 'Administrasi' },
      { id: 'bank_account', title: 'Buka Rekening Bank Lokal (DBS/POSB)', description: 'Untuk penerimaan gaji non-tunai secara legal & transparan', required: false, docType: 'Keuangan' },
      { id: 'skills_cert', title: 'Sertifikat Kompetensi (SkillMatch VC)', description: 'Verifiable Credential keahlian caregiving/hospitality untuk negosiasi upah', required: false, docType: 'Kualifikasi' },
      { id: 'emergency_contact', title: 'Kartu Kontak Darurat & Salinan Dokumen', description: 'Nomor Hotline KBRI dan kontak keluarga yang ditinggalkan', required: true, docType: 'Keamanan' }
    ]
  },
  {
    code: 'MYS',
    name: 'Malaysia',
    flag: '🇲🇾',
    currency: 'MYR',
    embassy: {
      name: 'KBRI Kuala Lumpur',
      address: 'No. 233 Jalan Tun Razak, 50400 Kuala Lumpur',
      phone: '+60 3 2116 4016',
      hotline: '+60 17 668 5547 (Satgas Perlindungan)',
      portalUrl: 'https://kemlu.go.id/kualalumpur'
    },
    keyNotes: 'Pastikan jalur resmi melalui e-PPAx / SIAPKERJA dan terdaftar di SOCSO/PERKESO.',
    items: [
      { id: 'passport', title: 'Paspor Republik Indonesia', description: 'Masa berlaku paspor minimal 18 bulan', required: true, docType: 'Identitas' },
      { id: 'visa', title: 'Calling Visa / VDR (Visa Dengan Rujukan)', description: 'Dikeluarkan oleh Jabatan Imigresen Malaysia (JIM)', required: true, docType: 'Izin Kerja' },
      { id: 'medical', title: 'Medical Check-Up FOMEMA', description: 'Pemeriksaan pra-keberangkatan di klinik panel FOMEMA resmi', required: true, docType: 'Kesehatan' },
      { id: 'contract', title: 'Perjanjian Kerja (PK) Bersertifikat', description: 'Disahkan oleh Perwakilan RI di Malaysia dan Kemenaker RI', required: true, docType: 'Legal' },
      { id: 'insurance', title: 'Kepesertaan SOCSO & EIS (PERKESO)', description: 'Skim Bencana Pekerjaan untuk perlindungan kecelakaan kerja di Malaysia', required: true, docType: 'Perlindungan' },
      { id: 'bpjs', title: 'BPJS Ketenagakerjaan PMI', description: 'Jaminan kecelakaan kerja dan kematian luar negeri', required: true, docType: 'Asuransi RI' },
      { id: 'embassy_reg', title: 'Lapor Diri KBRI KL / KJRI', description: 'Pencatatan data pekerja migran di portal Peduli WNI', required: false, docType: 'Administrasi' },
      { id: 'emergency_contact', title: 'Daftar Kontak Darurat & Hotline Satgas', description: 'Simpan kontak KBRI, Konsulat, dan perwakilan serikat pekerja', required: true, docType: 'Keamanan' }
    ]
  },
  {
    code: 'HKG',
    name: 'Hong Kong',
    flag: '🇭🇰',
    currency: 'HKD',
    embassy: {
      name: 'KJRI Hong Kong',
      address: '127-129 Leighton Road, Causeway Bay, Hong Kong',
      phone: '+852 3651 0200',
      hotline: '+852 6773 0466 (Emergency PMI)',
      portalUrl: 'https://kemlu.go.id/hongkong'
    },
    keyNotes: 'Upah Minimum Legal (MAW) dijamin regulasi HK Labor Department beserta jaminan tiket kepulangan.',
    items: [
      { id: 'passport', title: 'Paspor RI', description: 'Masa berlaku minimal 12 bulan', required: true, docType: 'Identitas' },
      { id: 'visa', title: 'Domestic Helper Visa (ID407)', description: 'Izin tinggal dan kerja resmi dari Hong Kong Immigration Department', required: true, docType: 'Izin Kerja' },
      { id: 'medical', title: 'Tes Medis Komprehensif', description: 'Klinik resmi yang disetujui HK Immigration', required: true, docType: 'Kesehatan' },
      { id: 'contract', title: 'Standard Employment Contract (SEC ID407)', description: 'Wajib ditandatangani kedua belah pihak dengan gaji minimum HKD 4,870+', required: true, docType: 'Legal' },
      { id: 'insurance', title: 'Employees Compensation Insurance', description: 'Asuransi kesehatan dan rawat inap wajib dibayar majikan', required: true, docType: 'Perlindungan' },
      { id: 'hkid', title: 'Pendaftaran HKID Card (Pasca Tiba)', description: 'Wajib daftar identitas HKID dalam 30 hari kedatangan', required: false, docType: 'Administrasi' },
      { id: 'embassy_reg', title: 'Lapor Diri Online KJRI HK', description: 'Registrasi data kedatangan di KJRI Causeway Bay', required: false, docType: 'Administrasi' },
      { id: 'emergency_contact', title: 'Hotline Perlindungan KJRI & NGO HK', description: 'Mission for Migrant Workers & hotline kepolisian 999', required: true, docType: 'Keamanan' }
    ]
  },
  {
    code: 'TWN',
    name: 'Taiwan',
    flag: '🇹🇼',
    currency: 'TWD',
    embassy: {
      name: 'KDEI Taipei (Kantor Dagang & Ekonomi Indonesia)',
      address: '6F, No. 550, Rui Guang Road, Neihu District, Taipei City',
      phone: '+886 2 8752 6170',
      hotline: '+886 973 830 653 (Hotline Satgas KDEI)',
      portalUrl: 'https://www.kdei-taipei.org'
    },
    keyNotes: 'Pekerja migran dilindungi Asuransi Kesehatan Nasional (NHI) dan Hotline Pengaduan 1955 gratis 24 jam berbahasa Indonesia.',
    items: [
      { id: 'passport', title: 'Paspor Asli RI', description: 'Masa berlaku minimal 12 bulan', required: true, docType: 'Identitas' },
      { id: 'visa', title: 'Resident Visa / Work Visa Taiwan', description: 'Visa kerja terbitan TETO (Taipei Economic & Trade Office) Jakarta/Surabaya', required: true, docType: 'Izin Kerja' },
      { id: 'medical', title: 'Pemeriksaan Kesehatan Pra-Penempatan', description: 'Rumah sakit yang ditunjuk Centers for Disease Control (CDC) Taiwan', required: true, docType: 'Kesehatan' },
      { id: 'contract', title: 'Perjanjian Kerja Dwibahasa (Mandarin - Indonesia)', description: 'Telah diverifikasi oleh KDEI Taipei', required: true, docType: 'Legal' },
      { id: 'arc', title: 'Alien Resident Certificate (ARC)', description: 'Kartu izin tinggal Taiwan (diurus dalam 15 hari setelah mendarat)', required: true, docType: 'Identitas Lokal' },
      { id: 'insurance', title: 'National Health Insurance (NHI) & Labor Insurance', description: 'Asuransi wajib dengan fasilitas rawat medis lengkap', required: true, docType: 'Perlindungan' },
      { id: 'hotline1955', title: 'Simpan Hotline 1955 Taiwan', description: 'Panggilan darurat & konsultasi ketenagakerjaan gratis berbahasa Indonesia', required: true, docType: 'Keamanan' }
    ]
  },
  {
    code: 'KOR',
    name: 'Korea Selatan',
    flag: '🇰🇷',
    currency: 'KRW',
    embassy: {
      name: 'KBRI Seoul',
      address: '380 Yeouidaebang-ro, Yeongdeungpo-gu, Seoul',
      phone: '+82 2 783 5675',
      hotline: '+82 10 5309 8820 (Hotline Darurat WNI)',
      portalUrl: 'https://kemlu.go.id/seoul'
    },
    keyNotes: 'Penempatan program G-to-G (Employment Permit System - EPS) dengan standar gaji minimum nasional Korea.',
    items: [
      { id: 'passport', title: 'Paspor RI', description: 'Masa berlaku minimal 12 bulan', required: true, docType: 'Identitas' },
      { id: 'eps_cert', title: 'Sertifikat Kelulusan EPS-TOPIK', description: 'Bukti kompetensi dasar bahasa Korea dan skill test HRD Korea', required: true, docType: 'Kualifikasi' },
      { id: 'visa', title: 'Visa Kerja E-9 (Non-profesional)', description: 'Diterbitkan Kedutaan Besar Republik Korea di Jakarta', required: true, docType: 'Izin Kerja' },
      { id: 'contract', title: 'Standard Labor Contract (HRD Korea)', description: 'Kontrak resmi Kementerian Ketenagakerjaan dan Perburuhan Korea (MOEL)', required: true, docType: 'Legal' },
      { id: 'insurance', title: 'Empat Asuransi Wajib (Industrial Accident, Health, dll)', description: 'Daftar asuransi kecelakaan kerja dan asuransi kepulangan (Departure Guarantee)', required: true, docType: 'Perlindungan' },
      { id: 'alien_reg', title: 'Alien Registration Card (ARC)', description: 'Pendaftaran di Kantor Imigrasi Korea dalam 90 hari setelah tiba', required: false, docType: 'Administrasi' },
      { id: 'emergency_contact', title: 'Hotline KBRI Seoul & Korea Migrant Center', description: 'Akses bantuan hukum & perlindungan hak pekerja asing', required: true, docType: 'Keamanan' }
    ]
  },
  {
    code: 'JPN',
    name: 'Jepang',
    flag: '🇯🇵',
    currency: 'JPY',
    embassy: {
      name: 'KBRI Tokyo',
      address: '5-2-9 Higashi-Gotanda, Shinagawa-ku, Tokyo 141-0022',
      phone: '+81 3 3441 4201',
      hotline: '+81 80 3506 8612 / +81 80 4944 9308',
      portalUrl: 'https://kemlu.go.id/tokyo'
    },
    keyNotes: 'Skema SSW (Specified Skilled Worker / Tokutei Ginou) mewajibkan JLPT N4 / JFT-Basic dan kelulusan skill test teknis.',
    items: [
      { id: 'passport', title: 'Paspor RI', description: 'Masa berlaku minimal 12 bulan', required: true, docType: 'Identitas' },
      { id: 'coe', title: 'Certificate of Eligibility (CoE)', description: 'Surat kelayakan dari Kantor Imigrasi Jepang sebelum pengajuan visa', required: true, docType: 'Izin Tinggal' },
      { id: 'visa', title: 'Visa Tokutei Ginou (SSW) / Ginou Jisshusei', description: 'Diterbitkan Kedutaan Besar Jepang di Indonesia', required: true, docType: 'Izin Kerja' },
      { id: 'language_cert', title: 'Sertifikat Bahasa Jepang (JLPT N4 / JFT-Basic)', description: 'Bukti kemampuan komunikasi dasar bahasa Jepang', required: true, docType: 'Kualifikasi' },
      { id: 'skill_eval', title: 'Sertifikat Ujian Evaluasi Keterampilan Bidang', description: 'Misal: Caregiver, Konstruksi, Pengolahan Makanan, dsb.', required: true, docType: 'Kualifikasi' },
      { id: 'insurance', title: 'Shakai Hoken (Asuransi Sosial & Pensiun)', description: 'Asuransi kesehatan, kecelakaan kerja, dan dana pensiun Nenkin', required: true, docType: 'Perlindungan' },
      { id: 'zairyu', title: 'Zairyu Card (Kartu Penduduk Asing)', description: 'Diterima di bandara kedatangan (Narita/Haneda/Kansai)', required: true, docType: 'Identitas Lokal' },
      { id: 'emergency_contact', title: 'Kontak Darurat KBRI & OTIT / Organisasi Pendukung (TSO)', description: 'Bantuan konsultasi kehidupan & hak ketenagakerjaan di Jepang', required: true, docType: 'Keamanan' }
    ]
  },
  {
    code: 'SAU',
    name: 'Arab Saudi',
    flag: '🇸🇦',
    currency: 'SAR',
    embassy: {
      name: 'KBRI Riyadh & KJRI Jeddah',
      address: 'Diplomatic Quarter, P.O. Box 94343, Riyadh 11693',
      phone: '+966 11 488 2800',
      hotline: '+966 50 360 9667 (Hotline Satgas Perlindungan)',
      portalUrl: 'https://kemlu.go.id/riyadh'
    },
    keyNotes: 'Wajib melalui skema Satu Kanal (SPSK) resmi, tes medis GAMCA, dan registrasi di platform Qiwa/Musaned.',
    items: [
      { id: 'passport', title: 'Paspor RI (Masa Berlaku Ekstra)', description: 'Masa berlaku paspor minimal 24 bulan sebelum keberangkatan', required: true, docType: 'Identitas' },
      { id: 'visa', title: 'Visa Kerja Resmi (Iqama Visa)', description: 'Stempel visa dari Kedutaan Besar Arab Saudi setelah lolos verifikasi Enjaz', required: true, docType: 'Izin Kerja' },
      { id: 'gamca', title: 'Pemeriksaan Medis GAMCA (Wafid)', description: 'Pemeriksaan kesehatan di laboratorium panel GAMCA resmi', required: true, docType: 'Kesehatan' },
      { id: 'contract_musaned', title: 'Kontrak Kerja Terdaftar di Musaned / Qiwa', description: 'Perjanjian kerja terverifikasi sistem elektronik Kementerian Sumber Daya Manusia KSA', required: true, docType: 'Legal' },
      { id: 'insurance', title: 'Asuransi Kesehatan KSA (Council of Health Insurance)', description: 'Menjamin biaya perawatan medis selama berada di Arab Saudi', required: true, docType: 'Perlindungan' },
      { id: 'spsk', title: 'Verifikasi Sistem Penempatan Satu Kanal (SPSK)', description: 'Bukti perekrutan melalui perusahaan penempatan resmi terakreditasi', required: true, docType: 'Kepatuhan RI' },
      { id: 'emergency_contact', title: 'Hotline Darurat KBRI Riyadh & KJRI Jeddah', description: 'Simpan nomor darurat dan kontak tim satgas perlindungan WNI', required: true, docType: 'Keamanan' }
    ]
  },
  {
    code: 'ARE',
    name: 'Uni Emirat Arab',
    flag: '🇦🇪',
    currency: 'AED',
    embassy: {
      name: 'KBRI Abu Dhabi & KJRI Dubai',
      address: 'Zone 1, Sector 34, 22nd Street, Al Bateen, Abu Dhabi',
      phone: '+971 2 445 4448',
      hotline: '+971 56 615 6259 (Hotline 24 Jam)',
      portalUrl: 'https://kemlu.go.id/abudhabi'
    },
    keyNotes: 'Semua kontrak kerja harus terdaftar di MOHRE (Ministry of Human Resources and Emiratisation). Majikan menanggung seluruh visa & tiket.',
    items: [
      { id: 'passport', title: 'Paspor RI', description: 'Masa berlaku minimal 12 bulan', required: true, docType: 'Identitas' },
      { id: 'entry_permit', title: 'Employment Entry Permit', description: 'Surat izin masuk kerja resmi terbitan Otoritas Imigrasi UAE', required: true, docType: 'Izin Masuk' },
      { id: 'medical_uae', title: 'Pemeriksaan Medis UAE (DHA / SEHA)', description: 'Tes darah dan rontgen dada setelah tiba di UAE untuk proses Emirates ID', required: true, docType: 'Kesehatan' },
      { id: 'contract_mohre', title: 'Kontrak Kerja Standar MOHRE', description: 'Penawaran kerja resmi (Job Offer Letter) dan Unified Contract MOHRE', required: true, docType: 'Legal' },
      { id: 'emirates_id', title: 'Pendaftaran Emirates ID Card', description: 'Kartu identitas nasional UAE wajib untuk seluruh urusan administrasi', required: true, docType: 'Identitas Lokal' },
      { id: 'insurance', title: 'Asuransi Kesehatan (Daman / Enaya) & ILOE', description: 'Involuntary Loss of Employment scheme & asuransi kesehatan', required: true, docType: 'Perlindungan' },
      { id: 'emergency_contact', title: 'Hotline Perlindungan KBRI Abu Dhabi & KJRI Dubai', description: 'Kontak darurat dan akses bantuan konsuler resmi', required: true, docType: 'Keamanan' }
    ]
  }
];

export default function MigrationChecklistPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('SGP');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'required' | 'optional'>('all');

  const country = COUNTRIES.find((c) => c.code === selectedCountry) || COUNTRIES[0];

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`skillmatch_migration_${selectedCountry}`);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else {
        setCheckedItems({});
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [selectedCountry]);

  // Save progress
  const toggleItem = (itemId: string) => {
    const updated = { ...checkedItems, [itemId]: !checkedItems[itemId] };
    setCheckedItems(updated);
    try {
      localStorage.setItem(`skillmatch_migration_${selectedCountry}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    if (!checkedItems[itemId]) {
      toast.success('Langkah ditandai selesai! 🎯');
    }
  };

  const totalItems = country.items.length;
  const completedCount = country.items.filter((i) => checkedItems[i.id]).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const filteredItems = country.items.filter((item) => {
    if (filter === 'required') return item.required;
    if (filter === 'optional') return !item.required;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-3">
            <ShieldCheck className="h-4 w-4" /> Pilar 4: Safe Migration Checklist
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Panduan & Checklist Migrasi 8 Negara
          </h1>
          <p className="text-blue-100 mt-1 max-w-2xl text-sm md:text-base">
            Persiapan dokumen, visa, kontrak, dan hak hukum calon PMI secara legal, transparan, dan bebas penipuan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" /> Cetak Checklist
          </Button>
        </div>
      </div>

      {/* Country Selection Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {COUNTRIES.map((c) => {
          const isSelected = c.code === selectedCountry;
          return (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                  : 'bg-card hover:bg-muted text-foreground border-border'
              }`}
            >
              <span className="text-lg">{c.flag}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Checklist & Embassy Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Checklist (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{country.flag}</div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      Kesiapan Dokumen {country.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {completedCount} dari {totalItems} persyaratan telah terpenuhi
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
                  <p className="text-xs text-muted-foreground">Status Kesiapan</p>
                </div>
              </div>
              <Progress value={progressPercent} className="h-3 rounded-full" />

              {/* Filter Tabs */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                    className="text-xs"
                  >
                    Semua ({country.items.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === 'required' ? 'default' : 'outline'}
                    onClick={() => setFilter('required')}
                    className="text-xs"
                  >
                    Wajib ({country.items.filter((i) => i.required).length})
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === 'optional' ? 'default' : 'outline'}
                    onClick={() => setFilter('optional')}
                    className="text-xs"
                  >
                    Opsional ({country.items.filter((i) => !i.required).length})
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Tersimpan otomatis di browser
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Items List */}
          <div className="space-y-3">
            {filteredItems.map((item, idx) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-primary/5 border-primary/40 shadow-sm'
                      : 'bg-card border-border hover:border-primary/30'
                  }`}
                >
                  <div className="pt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-primary fill-primary/20 transition-all" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`font-semibold text-sm ${
                          isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.required ? (
                        <Badge variant="destructive" className="text-[10px] py-0 px-2">
                          Wajib
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] py-0 px-2">
                          Disarankan
                        </Badge>
                      )}
                      {item.docType && (
                        <Badge variant="outline" className="text-[10px] py-0 px-2 text-muted-foreground">
                          {item.docType}
                        </Badge>
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        isChecked ? 'text-muted-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Embassy & Important Notices */}
        <div className="space-y-6">
          {/* Key Advice Alert */}
          <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-700 dark:text-amber-400 flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4" /> Catatan Penting {country.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {country.keyNotes}
              </p>
            </CardContent>
          </Card>

          {/* Embassy & Protection Hotline */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Perwakilan RI Resmi
              </CardTitle>
              <CardDescription className="text-xs">
                Simpan nomor ini di ponsel Anda sebelum terbang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-foreground block">{country.embassy.name}</span>
                <span className="text-muted-foreground">{country.embassy.address}</span>
              </div>

              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold mb-1">
                  <PhoneCall className="h-3.5 w-3.5" /> Hotline Darurat 24 Jam:
                </div>
                <div className="text-sm font-bold text-red-700 dark:text-red-300">
                  {country.embassy.hotline}
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-muted-foreground mb-1">Telepon Kantor:</div>
                <div className="font-medium text-foreground">{country.embassy.phone}</div>
              </div>

              <a
                href={country.embassy.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full gap-1.5 py-2 px-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-xs transition-colors"
              >
                <span>Kunjungi Portal Resmi KBRI</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent>
          </Card>

          {/* Anti-Trafficking Tips */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> Aturan Bebas Jeratan Sindikat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Jangan pernah menyerahkan paspor asli kepada calo tanpa tanda terima resmi.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Pastikan visa yang terbit adalah <strong>Visa Kerja</strong>, bukan Visa Turis/Ziarah.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Salin digital seluruh dokumen ke penyimpanan awan (Google Drive / email pribadi).</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
