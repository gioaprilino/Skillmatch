import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'IDR', locale = 'id-ID'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, locale = 'id-ID'): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateMatchPercentage(score: number, maxScore: number): number {
  return Math.min(100, Math.round((score / maxScore) * 100));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Terjadi kesalahan yang tidak diketahui';
}

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  DOMESTIC_CARE: 'Perawatan Domestik',
  CONSTRUCTION: 'Konstruksi',
  MANUFACTURING: 'Manufaktur',
  AGRICULTURE: 'Pertanian',
  HOSPITALITY: 'Hospitality',
  MARITIME: 'Maritim',
  PLANTATION: 'Perkebunan',
  DRIVING: 'Pengemudi',
  BEAUTY_WELLNESS: 'Kecantikan & Wellness',
  DIGITAL_BASIC: 'Digital Dasar',
  LANGUAGE: 'Bahasa',
  ENTREPRENEURSHIP: 'Kewirausahaan',
  FINANCIAL_LITERACY: 'Literasi Keuangan',
  MIGRATION_RIGHTS: 'Hak Migrasi',
};

export const SKILL_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
  EXPERT: 'Ahli',
};

export const SKILL_LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'bg-gray-100 text-gray-700',
  INTERMEDIATE: 'bg-blue-100 text-blue-700',
  ADVANCED: 'bg-green-100 text-green-700',
  EXPERT: 'bg-purple-100 text-purple-700',
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Dipublikasikan',
  CLOSED: 'Ditutup',
  FILLED: 'Terisi',
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  APPLIED: 'Dilamar',
  SCREENING: 'Screening',
  INTERVIEW: 'Wawancara',
  OFFERED: 'Diberi Penawaran',
  ACCEPTED: 'Diterima',
  REJECTED: 'Ditolak',
  WITHDRAWN: 'Ditarik',
};

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  APPLIED: 'bg-blue-100 text-blue-700',
  SCREENING: 'bg-yellow-100 text-yellow-700',
  INTERVIEW: 'bg-orange-100 text-orange-700',
  OFFERED: 'bg-green-100 text-green-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-100 text-gray-700',
};

export function getSkillCategoryLabel(category: string): string {
  return SKILL_CATEGORY_LABELS[category] || category;
}

export function getSkillLevelLabel(level: string): string {
  return SKILL_LEVEL_LABELS[level] || level;
}

export function getSkillLevelColor(level: string): string {
  return SKILL_LEVEL_COLORS[level] || 'bg-gray-100 text-gray-700';
}

export function getJobStatusLabel(status: string): string {
  return JOB_STATUS_LABELS[status] || status;
}

export function getApplicationStatusLabel(status: string): string {
  return APPLICATION_STATUS_LABELS[status] || status;
}

export function getApplicationStatusColor(status: string): string {
  return APPLICATION_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
}

export const COUNTRIES = [
  { code: 'IDN', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'SGP', name: 'Singapura', flag: '🇸🇬' },
  { code: 'MYS', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'HKG', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TWN', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'KOR', name: 'Korea Selatan', flag: '🇰🇷' },
  { code: 'JPN', name: 'Jepang', flag: '🇯🇵' },
  { code: 'SAU', name: 'Arab Saudi', flag: '🇸🇦' },
  { code: 'ARE', name: 'Uni Emirat Arab', flag: '🇦🇪' },
  { code: 'QAT', name: 'Qatar', flag: '🇶🇦' },
  { code: 'KWT', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'OMN', name: 'Oman', flag: '🇴🇲' },
  { code: 'BHR', name: 'Bahrain', flag: '🇧🇭' },
];

export function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name || code;
}

export function getCountryFlag(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.flag || '🏳️';
}