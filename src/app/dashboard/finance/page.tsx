'use client';

import React, { useState } from 'react';
import {
  PiggyBank,
  Calculator,
  TrendingUp,
  AlertTriangle,
  ArrowRightLeft,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  HelpCircle,
  Building,
  Zap,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateToIdr: number;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'SGD', name: 'Dolar Singapura', symbol: 'S$', flag: '🇸🇬', rateToIdr: 11850 },
  { code: 'MYR', name: 'Ringgit Malaysia', symbol: 'RM', flag: '🇲🇾', rateToIdr: 3550 },
  { code: 'HKD', name: 'Dolar Hong Kong', symbol: 'HK$', flag: '🇭🇰', rateToIdr: 2050 },
  { code: 'TWD', name: 'Dolar Baru Taiwan', symbol: 'NT$', flag: '🇹🇼', rateToIdr: 510 },
  { code: 'KRW', name: 'Won Korea Selatan', symbol: '₩', flag: '🇰🇷', rateToIdr: 11.8 },
  { code: 'JPY', name: 'Yen Jepang', symbol: '¥', flag: '🇯🇵', rateToIdr: 108 },
  { code: 'SAR', name: 'Riyal Arab Saudi', symbol: 'SR', flag: '🇸🇦', rateToIdr: 4250 },
  { code: 'AED', name: 'Dirham UEA', symbol: 'AED', flag: '🇦🇪', rateToIdr: 4350 },
];

export default function FinancialLiteracyPage() {
  // Remittance Calculator State
  const [selectedCurrency, setSelectedCurrency] = useState<string>('SGD');
  const [foreignAmount, setForeignAmount] = useState<number>(1000);

  // Budget Simulation State
  const [monthlyIncomeIdr, setMonthlyIncomeIdr] = useState<number>(12000000);
  const [savingTargetIdr, setSavingTargetIdr] = useState<number>(50000000);
  const [contractMonths, setContractMonths] = useState<number>(24);

  const curr = CURRENCIES.find((c) => c.code === selectedCurrency) || CURRENCIES[0];
  const convertedIdr = Math.round(foreignAmount * curr.rateToIdr);

  // Remittance comparison calculations
  const fintechFeeIdr = 35000;
  const fintechReceived = Math.round(foreignAmount * curr.rateToIdr - fintechFeeIdr);

  const bankFeeIdr = 150000;
  const bankRate = curr.rateToIdr * 0.975; // 2.5% markup
  const bankReceived = Math.round(foreignAmount * bankRate - bankFeeIdr);

  const informalReceived = Math.round(foreignAmount * curr.rateToIdr * 0.92); // 8% cut + high risk

  // 50/30/20 Rule
  const livingCost = Math.round(monthlyIncomeIdr * 0.4); // 40% biaya hidup negara penempatan
  const remittanceFamily = Math.round(monthlyIncomeIdr * 0.35); // 35% kiriman keluarga
  const futureSavings = Math.round(monthlyIncomeIdr * 0.25); // 25% tabungan mandiri / modal pulang

  // Projected savings after contract
  const projectedTotalSavings = futureSavings * contractMonths;
  const targetProgress = Math.min(100, Math.round((projectedTotalSavings / savingTargetIdr) * 100));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-3">
          <PiggyBank className="h-4 w-4" /> Pilar 4: Financial Literacy & Remittance
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Manajemen Keuangan & Remittance PMI
        </h1>
        <p className="text-emerald-100 mt-1 max-w-2xl text-sm md:text-base">
          Optimalkan hasil keringat Anda di luar negeri. Hitung pengiriman uang legal berbiaya rendah, rancang tabungan masa depan, dan lindungi keluarga dari penipuan investasi.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="remittance" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md h-11">
          <TabsTrigger value="remittance" className="text-xs sm:text-sm">
            <ArrowRightLeft className="mr-1.5 h-4 w-4" /> Remittance
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-xs sm:text-sm">
            <TrendingUp className="mr-1.5 h-4 w-4" /> Alokasi Gaji
          </TabsTrigger>
          <TabsTrigger value="antiscam" className="text-xs sm:text-sm">
            <ShieldAlert className="mr-1.5 h-4 w-4" /> Anti-Scam
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: KALKULATOR REMITTANCE */}
        <TabsContent value="remittance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Card */}
            <Card className="lg:col-span-1 border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-600" /> Kalkulator Kirim Uang
                </CardTitle>
                <CardDescription className="text-xs">
                  Hitung konversi mata uang asing ke Rupiah (IDR) secara transparan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold">Pilih Mata Uang Negara Tujuan</Label>
                  <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setSelectedCurrency(c.code)}
                        className={`p-2 rounded-lg border text-center text-xs transition-all ${
                          selectedCurrency === c.code
                            ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm'
                            : 'bg-card hover:bg-muted text-foreground'
                        }`}
                      >
                        <span className="block text-base">{c.flag}</span>
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="foreignAmount" className="text-xs font-semibold">
                    Jumlah Kirim ({curr.code})
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-muted-foreground">
                      {curr.symbol}
                    </span>
                    <Input
                      id="foreignAmount"
                      type="number"
                      value={foreignAmount}
                      onChange={(e) => setForeignAmount(Math.max(0, Number(e.target.value)))}
                      className="pl-12 font-bold text-base"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    Estimasi Rupiah Diterima Keluarga
                  </span>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                    Rp {convertedIdr.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400/80 mt-1">
                    Kurs acuan pasar: 1 {curr.code} ≈ Rp {curr.rateToIdr.toLocaleString('id-ID')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Cards (Span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-emerald-600" /> Perbandingan Saluran Pengiriman Uang
              </h3>

              {/* FinTech Resmi (Recommended) */}
              <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 relative shadow-sm">
                <Badge className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[10px]">
                  Paling Hemat & Direkomendasikan
                </Badge>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">
                        FinTech Resmi Terlisensi BI (Wise, Topremit, PosPay)
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Kurs murni tanpa markup tersembunyi, dana sampai dalam menit/jam
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-base font-bold text-emerald-600">
                      Rp {fintechReceived.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[11px] text-muted-foreground">Biaya: Rp 35.000</span>
                  </div>
                </div>
              </div>

              {/* Bank Konvensional */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-muted text-muted-foreground">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        Transfer Bank Tradisional (SWIFT TT)
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Sangat aman, namun ada selisih kurs 2.5% dan biaya koresponden 2-3 hari kerja
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-base font-bold text-foreground">
                      Rp {bankReceived.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[11px] text-muted-foreground">Biaya: Rp 150.000</span>
                  </div>
                </div>
              </div>

              {/* Jalur Tidak Resmi (High Risk) */}
              <div className="p-4 rounded-xl border border-red-300 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/50">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-red-700 dark:text-red-400 text-sm">
                          Jasa Titip / Calo Informal (Bawah Tangan)
                        </h4>
                        <Badge variant="destructive" className="text-[9px] py-0">Bahaya</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Potongan kurs tinggi (5-10%), tanpa bukti transfer resmi, risiko uang dibawa lari
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-base font-bold text-red-600">
                      Rp {informalReceived.toLocaleString('id-ID')}
                    </div>
                    <span className="text-[11px] text-red-500 font-semibold">Potongan tersembunyi tinggi</span>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="flex items-start gap-2 p-3 bg-muted rounded-xl text-xs text-muted-foreground">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Tips Cerdas:</strong> Hindari mengirim uang berkali-kali dalam jumlah kecil. Kumpulkan satu bulan sekali melalui aplikasi fintech berizin resmi Bank Indonesia untuk menghemat hingga Rp 1.500.000/tahun dari biaya transfer!
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: ALOKASI GAJI & SIMULASI TABUNGAN */}
        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Parameter */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-emerald-600" /> Parameter Gaji & Kontrak
                </CardTitle>
                <CardDescription className="text-xs">
                  Simulasikan penghasilan bulanan Anda selama masa kerja
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="monthlyIncome" className="text-xs font-semibold">
                    Estimasi Gaji Bersih Bulanan (IDR)
                  </Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={monthlyIncomeIdr}
                    step={500000}
                    onChange={(e) => setMonthlyIncomeIdr(Number(e.target.value))}
                    className="font-bold text-sm mt-1"
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Rp {monthlyIncomeIdr.toLocaleString('id-ID')} / bulan
                  </span>
                </div>

                <div>
                  <Label htmlFor="contractDuration" className="text-xs font-semibold">
                    Durasi Kontrak Kerja
                  </Label>
                  <select
                    id="contractDuration"
                    value={contractMonths}
                    onChange={(e) => setContractMonths(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-background"
                  >
                    <option value={12}>1 Tahun (12 Bulan)</option>
                    <option value={24}>2 Tahun (24 Bulan) - Standar</option>
                    <option value={36}>3 Tahun (36 Bulan)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="savingTarget" className="text-xs font-semibold">
                    Target Modal Tabungan Purna-PMI
                  </Label>
                  <Input
                    id="savingTarget"
                    type="number"
                    value={savingTargetIdr}
                    step={5000000}
                    onChange={(e) => setSavingTargetIdr(Number(e.target.value))}
                    className="font-bold text-sm mt-1"
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Target: Rp {savingTargetIdr.toLocaleString('id-ID')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Projection & Distribution (Span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Formula Alokasi Bijak (40 / 35 / 25)</CardTitle>
                  <CardDescription className="text-xs">
                    Rekomendasi alokasi pendapatan agar tidak habis hanya untuk kebutuhan konsumtif
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category 1 */}
                  <div className="p-3.5 rounded-xl border bg-card flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-foreground">
                        Biaya Hidup & Pulsa di Luar Negeri (40%)
                      </span>
                      <p className="text-xs text-muted-foreground">Makan, paket data, transportasi, darurat pribadi</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-foreground">
                        Rp {livingCost.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">/ bulan</span>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div className="p-3.5 rounded-xl border bg-card flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-foreground">
                        Remittance Keluarga di Kampung (35%)
                      </span>
                      <p className="text-xs text-muted-foreground">Kebutuhan dapur, sekolah anak, orang tua</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-blue-600">
                        Rp {remittanceFamily.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">/ bulan</span>
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">
                        Tabungan Mandiri / Modal Usaha Pulang (25%)
                      </span>
                      <p className="text-xs text-muted-foreground">Rekening khusus atas nama sendiri yang tidak diutak-atik</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-emerald-600">
                        Rp {futureSavings.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">/ bulan</span>
                    </div>
                  </div>

                  {/* Projected total box */}
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-emerald-100">Proyeksi Tabungan Setelah {contractMonths} Bulan</span>
                      <div className="text-2xl font-bold">
                        Rp {projectedTotalSavings.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-white text-emerald-800 text-xs px-3 py-1 font-bold">
                        {targetProgress}% dari Target
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: EDUKASI ANTI-SCAM */}
        <TabsContent value="antiscam" className="space-y-4">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
            <h3 className="font-bold text-red-800 dark:text-red-300 text-sm flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" /> 5 Ciri-Ciri Utama Penipuan Finansial Terhadap PMI
            </h3>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1">
              Banyak PMI kehilangan seluruh tabungan bertahun-tahun akibat iming-iming investasi fiktif dan pinjaman online calo. Waspadai tanda bahaya berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-700 font-bold text-xs">1</span>
                  Janji Keuntungan Pasti & Tidak Masuk Akal
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Tawaran titip dana forex, robot trading, atau arisan lelang dengan imbal hasil 10-30% per bulan adalah 100% skema Ponzi. Jangan pernah tergiur testimoni palsu di media sosial.
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-700 font-bold text-xs">2</span>
                  Love Scam (Jeratan Asmara Daring)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Kenalan baru di medsos/TikTok yang mengaku pilot, tentara, atau pebisnis asing lalu meminta transfer uang dengan dalih kiriman paket tertahan bea cukai adalah sindikat penipuan terorganisir.
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-700 font-bold text-xs">3</span>
                  Pinjam Nama Rekening / Identitas (Money Mule)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Jangan pernah meminjamkan nomor rekening bank atau kartu SIM lokal Anda kepada orang lain dengan imbalan komisi. Rekening Anda bisa dijadikan penampung uang judi online atau narkotika!
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-700 font-bold text-xs">4</span>
                  Pinjol Ilegal Tanpa Izin OJK
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Pinjaman online yang meminta akses kontak, galeri foto, atau membebankan bunga harian mencekik akan meneror keluarga di kampung. Pastikan hanya bertransaksi dengan entitas berizin resmi OJK.
              </CardContent>
            </Card>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                Merasa Menjadi Korban atau Menemukan Indikasi Penipuan?
              </h4>
              <p className="text-xs text-muted-foreground">
                Laporkan ke Satgas PASTI OJK melalui WhatsApp 081-157-157-157 atau email konsumen@ojk.go.id
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open('https://kontak157.ojk.go.id', '_blank');
              }}
            >
              Cek Legalitas Entitas (OJK)
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
