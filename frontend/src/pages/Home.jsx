import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Home as HomeIcon, TrendingUp, Star, Sparkles, Search,
  Shield, Clock, MessageCircle, ArrowRight, ChevronRight,
  Wallet, Users, ThumbsUp, Zap
} from 'lucide-react';
import API from '../utils/api';
import KostCard from '../components/KostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatRupiah } from '../utils/helpers';

/* Animated counter hook */
const useCounter = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!end) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 30));
    ref.current = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(ref.current); }
      else setCount(start);
    }, 30);
    return () => clearInterval(ref.current);
  }, [end, duration]);
  return count;
};

const features = [
  {
    icon: MapPin,
    title: 'Lokasi Akurat',
    desc: 'Peta interaktif dengan lokasi kost yang terverifikasi di seluruh Bengkulu',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-100',
  },
  {
    icon: Shield,
    title: 'Data Terpercaya',
    desc: 'Informasi harga dan fasilitas yang selalu diperbarui oleh admin',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    icon: Star,
    title: 'Review Asli',
    desc: 'Ulasan jujur dari penghuni kost untuk membantu keputusan Anda',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: Wallet,
    title: 'Estimasi Biaya',
    desc: 'Kalkulator biaya hidup lengkap termasuk makan, transport, dan lainnya',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
];

const testimonials = [
  {
    name: 'Andi S.',
    role: 'Mahasiswa UNIB',
    text: 'Sangat membantu saat cari kost! Fitur peta dan reviewnya bikin gampang pilih kost yang tepat.',
    rating: 5,
    initial: 'A',
    gradient: 'gradient-primary',
  },
  {
    name: 'Dina R.',
    role: 'Pekerja Swasta',
    text: 'Kalkulator estimasi biaya hidupnya keren banget. Jadi bisa plan budget bulanan dengan baik.',
    rating: 5,
    initial: 'D',
    gradient: 'gradient-violet',
  },
  {
    name: 'Budi P.',
    role: 'Mahasiswa Baru',
    text: 'Baru datang ke Bengkulu langsung bisa dapat kost yang cocok lewat platform ini. Recommended!',
    rating: 4,
    initial: 'B',
    gradient: 'gradient-rose',
  },
];

const Home = () => {
  const [kosts, setKosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, minPrice: 0, avgRating: 0 });

  const animTotal = useCounter(stats.total);
  const animRating = useCounter(stats.avgRating * 10) / 10;

  const fetchKosts = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await API.get('/kost', { params });
      setKosts(data);
      if (data.length > 0) {
        setStats({
          total: data.length,
          minPrice: Math.min(...data.map(k => Number(k.harga))),
          avgRating: parseFloat((data.reduce((sum, k) => sum + Number(k.avg_rating), 0) / data.length).toFixed(1)),
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchKosts(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HERO SECTION ===== */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
        <div className="particle particle-5" />
        <div className="particle particle-6" />
        <div className="particle particle-7" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/[0.03] animate-float" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-violet-400/10 animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-white/[0.02] animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 rounded-full bg-rose-400/10 animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5 animate-slide-up">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Platform Pencarian Kost #1 di Bengkulu
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
              Temukan{' '}
              <span className="relative">
                <span className="text-violet-300">Kost Impian</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C40 1 80 1 100 3.5C120 6 160 6 199 2" stroke="rgba(196,181,253,0.5)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <br />di Bengkulu
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-lg">
              Platform pencarian kost terlengkap dengan informasi harga, fasilitas, lokasi akurat, dan review dari penghuni.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to="/cari"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
              >
                <Search className="w-5 h-5" />
                Cari Kost Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cari"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/25 transition-all duration-300 text-sm"
              >
                <MapPin className="w-4 h-4" />
                Lihat Peta
              </Link>
            </div>

            {/* Quick Feature Tags */}
            <div className="flex flex-wrap gap-2">
              {['📍 Lokasi Akurat', '⭐ Review Terpercaya', '💰 Harga Transparan', '🔒 Aman', '🗺️ Peta Interaktif'].map((f, i) => (
                <span key={i} className="bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full animate-slide-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mt-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 animate-count-up" style={{ animationDelay: '0.4s' }}>
              <HomeIcon className="w-5 h-5 mx-auto mb-1.5 text-primary-200" />
              <p className="text-2xl sm:text-3xl font-bold">{animTotal}</p>
              <p className="text-xs text-blue-200 mt-0.5">Kost Tersedia</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 animate-count-up" style={{ animationDelay: '0.5s' }}>
              <TrendingUp className="w-5 h-5 mx-auto mb-1.5 text-emerald-300" />
              <p className="text-2xl sm:text-3xl font-bold">{stats.minPrice ? formatRupiah(stats.minPrice).replace('Rp', '').trim() : '-'}</p>
              <p className="text-xs text-blue-200 mt-0.5">Mulai dari</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 animate-count-up" style={{ animationDelay: '0.6s' }}>
              <Star className="w-5 h-5 mx-auto mb-1.5 text-amber-300 fill-amber-300" />
              <p className="text-2xl sm:text-3xl font-bold">{animRating.toFixed(1)}</p>
              <p className="text-xs text-blue-200 mt-0.5">Avg Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GRADIENT DIVIDER ===== */}
      <div className="section-divider" />

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="badge-violet mb-3">✨ Keunggulan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Kenapa Memilih <span className="text-gradient-violet">InfoKost</span>?
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Kami menyediakan pengalaman pencarian kost terbaik dengan fitur lengkap dan data terpercaya
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className={`card-gradient-border p-6 text-center group cursor-default animate-fade-in-up`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className={`w-14 h-14 ${feat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feat.icon className={`w-7 h-7 ${feat.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR KOSTS ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="badge-rose mb-2">🔥 Populer</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                Kost <span className="text-gradient-rose">Terpopuler</span>
              </h2>
              <p className="text-gray-500 mt-2">Rekomendasi kost dengan rating dan ulasan terbaik</p>
            </div>
            <Link
              to="/cari"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : kosts.length === 0 ? (
            <EmptyState title="Belum ada kost" description="Kost akan segera tersedia" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kosts.slice(0, 8).map((kost, index) => (
                <KostCard key={kost.id} kost={kost} style={{ animationDelay: `${index * 0.1}s` }} />
              ))}
            </div>
          )}

          {/* Mobile "Lihat Semua" */}
          <div className="sm:hidden text-center mt-8">
            <Link to="/cari" className="btn-violet inline-flex items-center gap-2">
              Lihat Semua Kost
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Desktop CTA */}
          {kosts.length > 8 && (
            <div className="hidden sm:block text-center mt-10">
              <Link to="/cari" className="btn-gradient inline-flex items-center gap-2 text-sm">
                <Search className="w-4 h-4" />
                Jelajahi {kosts.length - 8}+ Kost Lainnya
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 gradient-mixed opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="badge-blue mb-3">💬 Testimoni</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Apa Kata <span className="text-gradient-mixed">Pengguna Kami</span>?
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Ribuan mahasiswa dan pekerja sudah menemukan kost idaman mereka
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="card-premium p-6 relative overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-50 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>

                {/* User */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`w-10 h-10 ${t.gradient} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{t.initial}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="gradient-mixed rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 animate-float" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 animate-float" style={{ animationDelay: '2s' }} />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Siap Mencari Kost?
              </h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">
                Temukan kost terbaik di Bengkulu dengan peta interaktif, filter lengkap, dan review asli dari penghuni.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/cari"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
                >
                  <Search className="w-5 h-5" />
                  Mulai Cari Kost
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/25 transition-all duration-300 text-sm"
                >
                  <Users className="w-4 h-4" />
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;