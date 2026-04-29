import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { MapPin, Search, Star, SlidersHorizontal, ChevronDown, X, Map, LayoutGrid, Sparkles } from 'lucide-react';
import API from '../utils/api';
import KostCard from '../components/KostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatRupiah } from '../utils/helpers';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const violetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const CENTER = [-3.7982, 102.2600];

const SearchPage = () => {
  const [kosts, setKosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('split'); // 'split', 'map', 'grid'

  // Filter states
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('harga_asc');
  const [selectedFasilitas, setSelectedFasilitas] = useState([]);
  const [fasilitasList, setFasilitasList] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchFasilitas = async () => {
      try {
        const { data } = await API.get('/fasilitas');
        setFasilitasList(data);
      } catch {
        setFasilitasList([
          { id: 1, nama: 'WiFi' }, { id: 2, nama: 'AC' }, { id: 3, nama: 'Kamar Mandi Dalam' },
          { id: 4, nama: 'Parkir Motor' }, { id: 5, nama: 'Parkir Mobil' }, { id: 6, nama: 'Dapur' },
          { id: 7, nama: 'Listrik Token' }, { id: 8, nama: 'Akses 24 Jam' }
        ]);
      }
    };
    fetchFasilitas();
    fetchKosts();
  }, []);

  const fetchKosts = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await API.get('/kost', { params });
      setKosts(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchKosts({
      search,
      minPrice,
      maxPrice,
      sortBy,
      fasilitas: selectedFasilitas.join(',')
    });
  };

  const handleReset = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('harga_asc');
    setSelectedFasilitas([]);
    fetchKosts({});
  };

  const toggleFasilitas = (id) => {
    setSelectedFasilitas(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const hasFilters = search || minPrice || maxPrice || selectedFasilitas.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="gradient-hero text-white relative overflow-hidden">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-6" />
        <div className="particle particle-7" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/[0.03] animate-float" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-violet-400/10 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Jelajahi Semua Kost di Bengkulu
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Cari <span className="text-violet-300">Kost Impian</span> Anda
            </h1>
            <p className="text-blue-100 max-w-lg mx-auto">
              Gunakan peta interaktif dan filter lengkap untuk menemukan kost yang sempurna
            </p>
          </div>

          {/* Main Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama kost, alamat, atau area..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-sm bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-violet !py-3.5 !px-8 shadow-lg flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Cari</span>
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-sm shadow-lg transition-all ${
                  filtersOpen ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expanded Filters */}
            {filtersOpen && (
              <div className="mt-3 p-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg animate-fade-in text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Harga Minimum</label>
                    <input
                      type="number"
                      placeholder="Rp Min"
                      className="input-modern !py-2 text-sm"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Harga Maximum</label>
                    <input
                      type="number"
                      placeholder="Rp Max"
                      className="input-modern !py-2 text-sm"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Urutkan</label>
                    <select
                      className="input-modern !py-2 text-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="harga_asc">💰 Termurah</option>
                      <option value="harga_desc">💎 Termahal</option>
                      <option value="rating">⭐ Rating Tertinggi</option>
                      <option value="populer">🔥 Paling Populer</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Fasilitas</label>
                  <div className="flex flex-wrap gap-2">
                    {fasilitasList.map(f => (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => toggleFasilitas(f.id)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                          selectedFasilitas.includes(f.id)
                            ? 'bg-violet-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {f.nama}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button type="submit" className="btn-violet flex-1 text-sm !py-2 flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" />Terapkan Filter
                  </button>
                  {hasFilters && (
                    <button type="button" onClick={handleReset} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 text-sm flex items-center gap-1">
                      <X className="w-4 h-4" /> Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* View Toggle + Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-600">
              {loading ? 'Mencari...' : `${kosts.length} kost ditemukan`}
            </h2>
            {hasFilters && (
              <span className="badge-violet">Filter aktif</span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('split')}
              className={`p-2 rounded-lg text-sm transition-all ${view === 'split' ? 'bg-white shadow text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Split View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('map')}
              className={`p-2 rounded-lg text-sm transition-all ${view === 'map' ? 'bg-white shadow text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {view === 'map' ? (
          /* Full Map View */
          <div className="rounded-2xl overflow-hidden shadow-card border border-gray-100 bg-white" style={{ height: 'calc(100vh - 250px)' }}>
            <MapContainer center={CENTER} zoom={13} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {kosts.map((kost) => (
                <Marker key={kost.id} position={[parseFloat(kost.latitude), parseFloat(kost.longitude)]} icon={violetIcon}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <h4 className="font-bold text-sm text-gray-900">{kost.nama}</h4>
                      <p className="text-violet-600 font-semibold text-sm mt-1">{formatRupiah(kost.harga)}/bln</p>
                      <p className="text-xs text-gray-500 mt-0.5">★ {kost.avg_rating} ({kost.total_review} ulasan)</p>
                      <a href={`/kost/${kost.id}`} className="inline-block mt-2 text-xs bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-700">
                        Lihat Detail →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <Marker position={[-3.75868, 102.27289]} icon={blueIcon}>
                <Popup><strong>Universitas Bengkulu (UNIB)</strong></Popup>
              </Marker>
              <Marker position={[-3.7870, 102.2560]} icon={greenIcon}>
                <Popup><strong>RS M. Yunus</strong></Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          /* Split View */
          <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: 'calc(100vh - 300px)' }}>
            {/* Kost List */}
            <div className="lg:w-2/5 xl:w-[45%] flex flex-col gap-4">
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-4" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                {loading ? (
                  <LoadingSpinner />
                ) : kosts.length === 0 ? (
                  <EmptyState title="Kost tidak ditemukan" description="Coba ubah filter atau kata kunci pencarian Anda" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    {kosts.map((kost, index) => (
                      <KostCard key={kost.id} kost={kost} style={{ animationDelay: `${index * 0.1}s` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Map Panel */}
            <div className="lg:w-3/5 xl:w-[55%] rounded-2xl overflow-hidden shadow-card border border-gray-100 bg-white min-h-[400px] lg:min-h-0 lg:sticky lg:top-20 lg:self-start" style={{ height: 'calc(100vh - 250px)' }}>
              <MapContainer center={CENTER} zoom={13} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {kosts.map((kost) => (
                  <Marker key={kost.id} position={[parseFloat(kost.latitude), parseFloat(kost.longitude)]} icon={redIcon}>
                    <Popup>
                      <div className="min-w-[200px]">
                        <h4 className="font-bold text-sm text-gray-900">{kost.nama}</h4>
                        <p className="text-violet-600 font-semibold text-sm mt-1">{formatRupiah(kost.harga)}/bln</p>
                        <p className="text-xs text-gray-500 mt-0.5">★ {kost.avg_rating} ({kost.total_review} ulasan)</p>
                        <a href={`/kost/${kost.id}`} className="inline-block mt-2 text-xs bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-700">
                          Lihat Detail →
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <Marker position={[-3.75868, 102.27289]} icon={blueIcon}>
                  <Popup><strong>Universitas Bengkulu (UNIB)</strong></Popup>
                </Marker>
                <Marker position={[-3.7870, 102.2560]} icon={greenIcon}>
                  <Popup><strong>RS M. Yunus</strong></Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
