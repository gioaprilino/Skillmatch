'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Sparkles,
  MapPin,
  ShieldAlert,
  Send,
  PlusCircle,
  HelpCircle,
  Search,
  Bookmark,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Post {
  id: string;
  author: string;
  location: string;
  roleBadge: string;
  timeAgo: string;
  category: 'Tips Kerja' | 'Hukum & Legalitas' | 'Finansial & Remittance' | 'Kisah Sukses';
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: 'Rina Wulandari',
    location: 'Singapura (Ang Mo Kio)',
    roleBadge: 'Caregiver Lansia • 4 Tahun',
    timeAgo: '2 jam yang lalu',
    category: 'Tips Kerja',
    title: 'Tips Lolos Interview Caregiver di Singapura & Bahasa Inggris Sehari-hari',
    content: 'Teman-teman yang mau ambil visa caregiver ke Singapura, kuncinya jangan gugup saat user video call. Kuasai istilah medis dasar seperti Blood Pressure (tensi), Mobility Assistance (bantu jalan), dan Diaper change. Sertifikat SkillMatch dengan VC kemarin sangat membantu meyakinkan agensi MOM!',
    likes: 34,
    commentsCount: 12,
  },
  {
    id: 'post-2',
    author: 'Slamet Riyadi',
    location: 'Jepang (Nagoya)',
    roleBadge: 'Welder SSW • 2 Tahun',
    timeAgo: '5 jam yang lalu',
    category: 'Finansial & Remittance',
    title: 'Cara Kirim Yen ke Rupiah Tanpa Biaya Tersembunyi (Hemat 3000 Yen/Bulan)',
    content: 'Dulu saya sering kirim uang lewat counter biasa, kursnya dipotong lumayan besar. Sekarang pakai kalkulator di tab Keuangan SkillMatch, bisa bandingin kurs Fintech resmi vs Bank. Lumayan selisihnya bisa buat tambahan tabungan modal usaha di kampung.',
    likes: 58,
    commentsCount: 23,
  },
  {
    id: 'post-3',
    author: 'Hendra Gunawan',
    location: 'Hong Kong (Wan Chai)',
    roleBadge: 'F&B Service • 3 Tahun',
    timeAgo: '1 hari yang lalu',
    category: 'Hukum & Legalitas',
    title: 'Penting! Jangan Pernah Serahkan Paspor Asli ke Siapapun',
    content: 'Pengingat untuk teman-teman PMI baru di Hong Kong: Berdasarkan aturan Labour Department dan KBRI, paspor dan HKID adalah dokumen pribadi yang berhak dipegang sendiri oleh pekerja. Majikan atau agensi tidak berhak menahan. Jika ada pemaksaan, segera lapor ke posko bantuan KBRI.',
    likes: 82,
    commentsCount: 19,
  },
  {
    id: 'post-4',
    author: 'Dewi Lestari',
    location: 'Banyuwangi (Purna PMI Taiwan)',
    roleBadge: 'Wirausaha Purna • Toko Sembako',
    timeAgo: '2 hari yang lalu',
    category: 'Kisah Sukses',
    title: 'Dari 5 Tahun di Taiwan, Pulang Berhasil Bangun Toko & Grosir Berkat Rumus 40/35/25',
    content: 'Dulu saya selalu terapkan rumus SkillMatch: 40% kirim orang tua, 35% kebutuhan lokal di Taichung, 25% tabungan mati di rekening khusus. Alhamdulillah setelah kontrak selesai, tabungan cukup buat modal toko sendiri dan tidak perlu berangkat lagi.',
    likes: 124,
    commentsCount: 45,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'Tips Kerja' | 'Hukum & Legalitas' | 'Finansial & Remittance' | 'Kisah Sukses'>('Tips Kerja');
  const [isPosting, setIsPosting] = useState(false);

  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Harap isi judul dan isi diskusi.');
      return;
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: 'Anda (PMI Aktif)',
      location: 'Indonesia',
      roleBadge: 'Pekerja Terverifikasi',
      timeAgo: 'Baru saja',
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      likes: 1,
      commentsCount: 0,
      isLiked: true,
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsPosting(false);
    toast.success('Diskusi berhasil dipublikasikan ke Komunitas!');
  };

  const categories = ['Semua', 'Tips Kerja', 'Hukum & Legalitas', 'Finansial & Remittance', 'Kisah Sukses'];

  const filteredPosts = posts.filter(p => {
    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-primary p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Users className="h-6 w-6 text-white" />
            </span>
            <h1 className="text-2xl font-bold">Komunitas & Diaspora PMI</h1>
          </div>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Ruang aman bertukar informasi, perlindungan hak ketenagakerjaan, tips adaptasi luar negeri, dan inspirasi kemandirian finansial bagi pekerja migran Indonesia.
          </p>
        </div>
        <Button
          onClick={() => setIsPosting(!isPosting)}
          className="bg-white text-blue-700 hover:bg-white/90 shadow font-semibold gap-2 self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          {isPosting ? 'Tutup Form' : 'Mulai Diskusi Baru'}
        </Button>
      </div>

      {/* New Post Form Modal/Collapse */}
      {isPosting && (
        <Card className="border-primary/40 shadow-md animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Tulis Pertanyaan atau Berbagi Pengalaman
            </CardTitle>
            <CardDescription>
              Postingan Anda akan terlihat oleh sesama pekerja migran dan diaspora Indonesia di seluruh dunia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  >
                    <option value="Tips Kerja">Tips Kerja</option>
                    <option value="Hukum & Legalitas">Hukum & Legalitas</option>
                    <option value="Finansial & Remittance">Finansial & Remittance</option>
                    <option value="Kisah Sukses">Kisah Sukses</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Judul Diskusi</label>
                  <Input
                    placeholder="Contoh: Pengalaman pertama kerja di pabrik Taiwan..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Isi Pengalaman / Pertanyaan</label>
                <Textarea
                  rows={4}
                  placeholder="Ceritakan detail pengalaman atau ajukan pertanyaan..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsPosting(false)}>
                  Batal
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  Kirim Diskusi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari topik atau negara..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 text-sm h-9"
          />
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Card key={post.id} className="hover:border-primary/30 transition-all shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{post.author}</span>
                      <span className="text-xs text-muted-foreground">• {post.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1 text-primary">
                        <MapPin className="h-3 w-3" /> {post.location}
                      </span>
                      <span>•</span>
                      <span>{post.roleBadge}</span>
                    </div>
                  </div>
                </div>

                <Badge variant="secondary" className="text-xs shrink-0">
                  {post.category}
                </Badge>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-base hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isLiked ? 'text-red-500 font-semibold' : 'hover:text-foreground'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500' : ''}`} />
                    <span>{post.likes} Suka</span>
                  </button>
                  <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.commentsCount} Komentar</span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Tautan diskusi disalin ke clipboard!');
                  }}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Bagikan</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
