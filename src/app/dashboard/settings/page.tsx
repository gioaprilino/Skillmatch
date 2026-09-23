'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Bell,
  Globe,
  Shield,
  Smartphone,
  Moon,
  Sun,
  Save,
  CheckCircle2,
  Lock,
  WifiOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [waNotifications, setWaNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [visaReminders, setVisaReminders] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Pengaturan berhasil disimpan!');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Pengaturan Akun & Aplikasi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Atur notifikasi lowongan, preferensi bahasa, dan fitur offline PWA untuk kemudahan Anda
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifikasi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifikasi & Peringatan Lowongan
            </CardTitle>
            <CardDescription>
              Tentukan bagaimana Anda ingin menerima kabar lowongan cocok dan status migrasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Notifikasi WhatsApp Real-time</Label>
                <p className="text-xs text-muted-foreground">
                  Dapatkan alert instan via WA saat ada employer luar negeri tertarik dengan profil Anda
                </p>
              </div>
              <Switch checked={waNotifications} onCheckedChange={setWaNotifications} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Email Rekomendasi Mingguan</Label>
                <p className="text-xs text-muted-foreground">
                  Rangkuman lowongan kerja luar negeri dengan kecocokan skill &gt;80%
                </p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Peringatan Dokumen & Visa</Label>
                <p className="text-xs text-muted-foreground">
                  Pengingat perpanjangan paspor, pemeriksaan medis FOMEMA, dan tanggal lapor diri KBRI
                </p>
              </div>
              <Switch checked={visaReminders} onCheckedChange={setVisaReminders} />
            </div>
          </CardContent>
        </Card>

        {/* Aksesibilitas & PWA Offline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-primary" />
              Akses Offline (Progressive Web App)
            </CardTitle>
            <CardDescription>
              Optimasi aplikasi untuk pekerja informal saat keterbatasan sinyal internet di luar negeri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold">Cache Offline Dokumen & Checklist</Label>
                  <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600">PWA Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Simpan checklist migrasi, nomor darurat KBRI, dan sertifikat VC di penyimpanan lokal HP
                </p>
              </div>
              <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Bahasa Antarmuka (Interface Language)</Label>
                <p className="text-xs text-muted-foreground">
                  Pilih bahasa pengantar aplikasi
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={language === 'id' ? 'default' : 'outline'}
                  onClick={() => setLanguage('id')}
                  className="text-xs"
                >
                  Bahasa Indonesia
                </Button>
                <Button
                  size="sm"
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => setLanguage('en')}
                  className="text-xs"
                >
                  English
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keamanan & Kata Sandi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Keamanan Akun
            </CardTitle>
            <CardDescription>
              Perbarui kata sandi akun SkillMatch Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-pass">Kata Sandi Saat Ini</Label>
                <Input id="current-pass" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pass">Kata Sandi Baru (min. 8 karakter)</Label>
                <Input id="new-pass" type="password" placeholder="••••••••" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
