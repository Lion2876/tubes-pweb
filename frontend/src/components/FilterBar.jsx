import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import API from '../utils/api';

const FilterBar = ({ onFilter }) => {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('harga_asc');
  const [selectedFasilitas, setSelectedFasilitas] = useState([]);
  const [fasilitasList, setFasilitasList] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchFasilitas = async () => {
      try {
        const { data } = await API.get('/fasilitas');
        setFasilitasList(data);
      } catch {
        // fallback
        setFasilitasList([
          { id: 1, nama: 'WiFi' }, { id: 2, nama: 'AC' }, { id: 3, nama: 'Kamar Mandi Dalam' },
          { id: 4, nama: 'Parkir Motor' }, { id: 5, nama: 'Parkir Mobil' }, { id: 6, nama: 'Dapur' },
          { id: 7, nama: 'Listrik Token' }, { id: 8, nama: 'Akses 24 Jam' }
        ]);
      }
    };
    fetchFasilitas();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
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
    onFilter({});
  };

  const toggleFasilitas = (id) => {
    setSelectedFasilitas(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const hasFilters = search || minPrice || maxPrice || selectedFasilitas.length > 0;

  return (
    <form onSubmit={handleSubmit} className="card-premium p-4 space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari nama kost atau lokasi..."
          className="input-modern !pl-11 !pr-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sort + filter toggle */}
      <div className="flex gap-2">
        <select
          className="input-modern flex-1 !py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="harga_asc">💰 Termurah</option>
          <option value="harga_desc">💎 Termahal</option>
          <option value="rating">⭐ Rating Tertinggi</option>
          <option value="populer">🔥 Paling Populer</option>
        </select>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
            expanded ? 'border-primary-400 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded filter section */}
      {expanded && (
        <div className="space-y-3 pt-2 animate-fade-in border-t border-gray-100">
          {/* Price range */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Rentang Harga
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min (Rp)"
                className="input-modern !py-2 text-sm"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-gray-300 font-medium">—</span>
              <input
                type="number"
                placeholder="Max (Rp)"
                className="input-modern !py-2 text-sm"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Fasilitas checkboxes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Fasilitas
            </label>
            <div className="flex flex-wrap gap-2">
              {fasilitasList.map(f => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => toggleFasilitas(f.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                    selectedFasilitas.includes(f.id)
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.nama}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="btn-primary flex-1 text-sm !py-2.5 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Cari
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default FilterBar;