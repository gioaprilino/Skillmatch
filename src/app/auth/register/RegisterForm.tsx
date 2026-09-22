'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Shield, Mail, Lock, User, Building2, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string(),
  role: z.enum(['WORKER', 'EMPLOYER']),
  phone: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, 'Anda harus menyetujui syarat & ketentuan'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'WORKER' | 'EMPLOYER') || 'WORKER';
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole, agreeTerms: false },
  });

  const watchedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Registrasi gagal');
      }

      toast.success('Akun berhasil dibuat! Silakan cek email untuk verifikasi.');
      router.push('/auth/login?registered=true');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'WORKER', label: 'Saya Pekerja (TKI/PMI)', desc: 'Cari lowongan, ikut asesmen, dapat sertifikat, checklist migrasi' },
    { value: 'EMPLOYER', label: 'Saya Perusahaan/Agen', desc: 'Posting lowongan, cari kandidat, verifikasi kredensial, kelola rekrutmen' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-7 w-7" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">Buat Akun SkillMatch</CardTitle>
          <CardDescription>
            Pilih peran Anda untuk memulai perjalanan karier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <Label className="block mb-3 font-medium">Saya ingin bergabung sebagai</Label>
              <RadioGroup
                onValueChange={value => setValue('role', value as 'WORKER' | 'EMPLOYER')}
                defaultValue={defaultRole}
                className="grid gap-4"
              >
                {roleOptions.map(option => (
                  <label
                    key={option.value}
                    className="relative flex cursor-pointer items-center p-4 border-2 rounded-lg transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem value={option.value} className="sr-only" />
                    <div className="mr-3 flex h-5 w-5 items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
              {errors.role && (
                <p className="mt-2 text-sm text-destructive" role="alert">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="name"
                    placeholder="Nama lengkap"
                    className="pl-10"
                    autoComplete="name"
                    {...register('name')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                </div>
                {errors.name && <p className="text-sm text-destructive" role="alert">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="anda@email.com"
                    className="pl-10"
                    autoComplete="email"
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive" role="alert">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && <p className="text-sm text-destructive" role="alert">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive" role="alert">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor WhatsApp (Opsional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+62 8xx xxx xxxx"
                autoComplete="tel"
                {...register('phone')}
              />
              <p className="text-xs text-muted-foreground">Digunakan untuk notifikasi & OTP login</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="text-sm text-muted-foreground">
                  Saya menyetujui <Link href="/syarat" className="text-primary hover:underline">Syarat & Ketentuan</Link> dan{' '}
                  <Link href="/privasi" className="text-primary hover:underline">Kebijakan Privasi</Link>
                </div>
              </label>
              {errors.agreeTerms && <p className="text-sm text-destructive" role="alert">{errors.agreeTerms.message}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Buat Akun
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}