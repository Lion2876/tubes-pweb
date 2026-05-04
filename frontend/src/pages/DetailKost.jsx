import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../utils/api';
import { formatRupiah, getImageUrl } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import WishlistButton from '../components/WishlistButton';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import {
  MapPin, Star, ChevronRight, Home, Wifi, Wind, Car, Bath,
  DoorOpen, Zap, Clock, UtensilsCrossed, Calculator, GitCompareArrows,
  Send, Lightbulb, TrendingDown, PiggyBank, Utensils, Bus, Smartphone, Phone
} from 'lucide-react';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const facilityIconMap = {
  'WiFi': Wifi, 'AC': Wind, 'Parkir Motor': Car, 'Parkir Mobil': Car,
  'Kamar Mandi Dalam': Bath, 'Dapur': UtensilsCrossed, 'Listrik Token': Zap,
  'Akses 24 Jam': Clock,
};

const COST_COLORS = {
  sewa: { bg: 'bg-primary-500', text: 'text-primary-600', light: 'bg-primary-50' },
  makan: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50' },
  transport: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50' },
  lain: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50' },
};

const tipsHemat = [
  { icon: Utensils, text: 'Masak sendiri bisa hemat Rp 300.000–500.000/bulan', color: 'text-violet-500' },
  { icon: Bus, text: 'Pilih kost dekat kampus untuk hemat transportasi', color: 'text-rose-500' },
  { icon: Smartphone, text: 'Gunakan paket internet bulanan daripada harian', color: 'text-primary-500' },
  { icon: PiggyBank, text: 'Alokasikan 10-20% untuk tabungan darurat', color: 'text-amber-500' },
];

const RupiahInput = ({ label, value, onChange, icon: Icon, iconColor }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleBlur = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 10000) {
      onChange(10000);
    } else {
      onChange(val);
    }
  };

  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        {label}
      </label>
      <div className="rupiah-input-wrapper">
        <span className="rupiah-prefix">Rp</span>
        <input
          type="number"
          step="1000"
          min="10000"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

const DetailKost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [kost, setKost] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [estimasi, setEstimasi] = useState({ makan: 900000, transport: 300000, lain: 200000 });
  const [totalBiaya, setTotalBiaya] = useState(0);

  const fetchData = async () => {
    try {
      const [kostRes, reviewRes] = await Promise.all([
        API.get(`/kost/${id}`),
        API.get(`/review/${id}`),
      ]);
      setKost(kostRes.data);
      setReviews(reviewRes.data);
    } catch {
      toast.error('Data kost tidak ditemukan');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  // Auto-calculate on mount and whenever kost or estimasi changes
  useEffect(() => {
    if (kost) {
      const total = Number(kost.harga) + Number(estimasi.makan) + Number(estimasi.transport) + Number(estimasi.lain);
      setTotalBiaya(total);
    }
  }, [kost, estimasi]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Silakan login untuk memberi review'); return; }
    setSubmitting(true);
    try {
      await API.post(`/review/${id}`, { rating: newRating, komentar: newComment });
      toast.success('Review berhasil ditambahkan! ⭐');
      setNewComment('');
      setNewRating(5);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambah review');
    }
    setSubmitting(false);
  };

  // Calculate cost segment percentages
  const getCostBreakdown = () => {
    if (totalBiaya === 0) return [];
    const sewa = Number(kost?.harga || 0);
    return [
      { key: 'sewa', label: 'Sewa', amount: sewa, pct: ((sewa / totalBiaya) * 100).toFixed(0), ...COST_COLORS.sewa },
      { key: 'makan', label: 'Makan', amount: estimasi.makan, pct: ((estimasi.makan / totalBiaya) * 100).toFixed(0), ...COST_COLORS.makan },
      { key: 'transport', label: 'Transport', amount: estimasi.transport, pct: ((estimasi.transport / totalBiaya) * 100).toFixed(0), ...COST_COLORS.transport },
      { key: 'lain', label: 'Lainnya', amount: estimasi.lain, pct: ((estimasi.lain / totalBiaya) * 100).toFixed(0), ...COST_COLORS.lain },
    ];
  };

  if (loading) return <LoadingSpinner />;
  if (!kost) return (
    <div className="text-center py-20">
      <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">Kost tidak ditemukan</p>
      <Link to="/" className="btn-primary mt-4 inline-block">Kembali ke Beranda</Link>
    </div>
  );

  const kostLat = parseFloat(kost.latitude);
  const kostLng = parseFloat(kost.longitude);
  const hasCoords = !isNaN(kostLat) && !isNaN(kostLng);
  const breakdown = getCostBreakdown();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-primary-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">{kost.nama}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={getImageUrl(kost.gambar)}
                alt={kost.nama}
                className="w-full h-72 sm:h-96 object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=400&fit=crop'; }}
              />
              <div className="absolute top-4 right-4"><WishlistButton kostId={kost.id} size="lg" /></div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{kost.nama}</h1>
                <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
                  <MapPin className="w-4 h-4" />{kost.alamat}
                </div>
              </div>
            </div>

            {/* Price & Rating bar */}
            <div className="card-premium p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Harga per bulan</p>
                <p className="text-2xl font-bold text-primary-600">{formatRupiah(kost.harga)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-2 rounded-xl">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-amber-700">{kost.avg_rating}</span>
                  <span className="text-xs text-amber-600">({kost.total_review} ulasan)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card-premium p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h2>
              <p className="text-gray-600 leading-relaxed">{kost.deskripsi || 'Belum ada deskripsi.'}</p>
            </div>

            {/* Fasilitas */}
            <div className="card-premium p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Fasilitas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {kost.fasilitas.map((f, idx) => {
                  const Icon = facilityIconMap[f] || DoorOpen;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                      <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{f}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaflet Map */}
            {hasCoords && (
              <div className="card-premium overflow-hidden">
                <div className="p-4 pb-0"><h2 className="text-lg font-bold text-gray-900">Lokasi</h2></div>
                <div className="p-4">
                  <div className="rounded-xl overflow-hidden h-64">
                    <MapContainer center={[kostLat, kostLng]} zoom={15} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      <Marker position={[kostLat, kostLng]}>
                        <Popup>
                          <strong>{kost.nama}</strong><br />{kost.alamat}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card-premium p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ulasan ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400">Belum ada ulasan. Jadilah yang pertama!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{rev.user_nama?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-gray-900">{rev.user_nama}</span>
                          <StarRating value={rev.rating} readonly size="sm" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rev.komentar}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(rev.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Review form */}
              {user && (
                <form onSubmit={handleSubmitReview} className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Tulis Ulasan</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <StarRating value={newRating} onChange={setNewRating} />
                  </div>
                  <textarea
                    rows="3"
                    placeholder="Bagikan pengalaman Anda tentang kost ini..."
                    className="input-modern resize-none"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={submitting} className="btn-primary mt-3 flex items-center gap-2">
                    {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    Kirim Review
                  </button>
                </form>
              )}
              {!user && (
                <div className="mt-4 p-4 bg-primary-50 rounded-xl text-center">
                  <p className="text-sm text-primary-700">
                    <Link to="/login" className="font-semibold hover:underline">Login</Link> untuk memberikan ulasan
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Estimasi Biaya Hidup */}
            <div className="card-premium p-5 border-t-4 border-violet-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Estimasi Biaya Hidup</h3>
                  <p className="text-xs text-gray-400">Per bulan di Bengkulu</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Sewa Kost (readonly) */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-primary-500" />
                    Sewa Kost
                  </label>
                  <div className="input-modern !bg-primary-50 !border-primary-200 text-primary-700 font-semibold">{formatRupiah(kost.harga)}</div>
                </div>

                {/* Biaya Makan */}
                <RupiahInput
                  label="Biaya Makan"
                  icon={Utensils}
                  iconColor="text-violet-500"
                  value={estimasi.makan}
                  onChange={(val) => setEstimasi({ ...estimasi, makan: val })}
                />

                {/* Transportasi */}
                <RupiahInput
                  label="Transportasi"
                  icon={Bus}
                  iconColor="text-rose-500"
                  value={estimasi.transport}
                  onChange={(val) => setEstimasi({ ...estimasi, transport: val })}
                />

                {/* Lain-lain */}
                <RupiahInput
                  label="Lain-lain (pulsa, laundry, dll)"
                  icon={Smartphone}
                  iconColor="text-amber-500"
                  value={estimasi.lain}
                  onChange={(val) => setEstimasi({ ...estimasi, lain: val })}
                />

                {/* Visual Cost Breakdown Bar */}
                {totalBiaya > 0 && (
                  <div className="animate-fade-in space-y-3 pt-2">
                    {/* Total */}
                    <div className="text-center p-4 rounded-xl gradient-mixed-soft border border-violet-100">
                      <p className="text-xs text-gray-500 mb-1">Estimasi Total per Bulan</p>
                      <p className="text-2xl font-bold text-gradient-mixed">{formatRupiah(totalBiaya)}</p>
                    </div>

                    {/* Stacked Bar */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Breakdown Biaya</p>
                      <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
                        {breakdown.map((item) => (
                          <div
                            key={item.key}
                            className={`${item.bg} transition-all duration-700 ease-out`}
                            style={{ width: `${item.pct}%` }}
                            title={`${item.label}: ${item.pct}%`}
                          />
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {breakdown.map((item) => (
                          <div key={item.key} className={`flex items-center gap-2 p-2 ${item.light} rounded-lg`}>
                            <div className={`w-3 h-3 rounded-full ${item.bg} flex-shrink-0`} />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500">{item.label} ({item.pct}%)</p>
                              <p className={`text-xs font-bold ${item.text}`}>{formatRupiah(item.amount)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Hemat */}
            <div className="card-premium p-5 border-t-4 border-rose-400">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Tips Hemat di Bengkulu</h3>
              </div>
              <div className="space-y-2.5">
                {tipsHemat.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 group">
                    <div className="w-6 h-6 rounded-full bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                      <tip.icon className={`w-3.5 h-3.5 ${tip.color}`} />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            {kost.no_hp && (
              <a
                href={`https://wa.me/${kost.no_hp}?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(kost.nama)}.%20Apakah%20masih%20tersedia?`}
                target="_blank"
                rel="noreferrer"
                className="card-premium p-4 flex items-center gap-3 bg-green-50 hover:bg-green-100 border-green-200 transition-colors group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Hubungi via WhatsApp</p>
                  <p className="text-xs text-green-600">+{kost.no_hp}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-green-400 ml-auto" />
              </a>
            )}

            {/* Compare Button */}
            <Link to={`/compare?ids=${kost.id}`} className="card-premium p-4 flex items-center gap-3 hover:bg-primary-50 transition-colors group">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <GitCompareArrows className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Bandingkan Kost</p>
                <p className="text-xs text-gray-400">Bandingkan dengan kost lainnya</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKost;