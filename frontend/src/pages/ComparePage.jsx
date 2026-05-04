import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GitCompareArrows, Star, MapPin, Check, X as XIcon, Plus } from 'lucide-react';
import API from '../utils/api';
import { formatRupiah, getImageUrl } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const [kostList, setKostList] = useState([]);
  const [allKosts, setAllKosts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(initialIds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await API.get('/kost');
        setAllKosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchSelected = async () => {
      if (selectedIds.length === 0) { setKostList([]); setLoading(false); return; }
      setLoading(true);
      try {
        const promises = selectedIds.map(id => API.get(`/kost/${id}`));
        const results = await Promise.all(promises);
        setKostList(results.map(res => res.data));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchSelected();
  }, [selectedIds]);

  const addKost = (id) => {
    if (!selectedIds.includes(String(id)) && selectedIds.length < 3) {
      setSelectedIds([...selectedIds, String(id)]);
    }
  };

  const removeKost = (id) => {
    setSelectedIds(selectedIds.filter(i => i !== String(id)));
  };

  const getMin = (key) => {
    if (kostList.length === 0) return null;
    return Math.min(...kostList.map(k => Number(k[key])));
  };

  const getMax = (key) => {
    if (kostList.length === 0) return null;
    return Math.max(...kostList.map(k => Number(k[key])));
  };

  const availableKosts = allKosts.filter(k => !selectedIds.includes(String(k.id)));

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-70 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-indigo-100/50">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <GitCompareArrows className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Bandingkan Kost</h1>
            <p className="text-sm font-medium text-indigo-400 mt-0.5">Bandingkan hingga 3 kost secara berdampingan untuk menemukan yang terbaik</p>
          </div>
        </div>

        {/* Selector */}
        {availableKosts.length > 0 && selectedIds.length < 3 && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-indigo-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-full opacity-50 pointer-events-none"></div>
            <label className="text-sm font-semibold text-indigo-900 mb-3 block relative z-10">Tambah kost untuk dibandingkan:</label>
            <div className="flex flex-wrap gap-2 relative z-10">
              {availableKosts.slice(0, 10).map(k => (
                <button
                  key={k.id}
                  onClick={() => addKost(k.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />{k.nama}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected tags */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {kostList.map(k => (
              <span key={k.id} className="badge-blue !px-3 !py-1.5 flex items-center gap-1.5">
                {k.nama}
                <button onClick={() => removeKost(String(k.id))} className="hover:text-red-500 transition-colors">
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {loading ? <LoadingSpinner /> : kostList.length === 0 ? (
          <EmptyState
            icon={GitCompareArrows}
            title="Pilih kost untuk dibandingkan"
            description="Tambahkan minimal 2 kost menggunakan tombol di atas"
          />
        ) : (
          <div className="animate-fade-in">
            {/* Cards grid */}
            <div className={`grid gap-4 mb-6 ${kostList.length === 1 ? 'grid-cols-1 max-w-md' : kostList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
              {kostList.map(kost => (
                <div key={kost.id} className="card-premium overflow-hidden">
                  <img
                    src={getImageUrl(kost.gambar)}
                    alt={kost.nama}
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'; }}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{kost.nama}</h3>
                    <p className={`text-lg font-bold mt-1 ${Number(kost.harga) === getMin('harga') ? 'text-accent-600' : 'text-primary-600'}`}>
                      {formatRupiah(kost.harga)}/bln
                      {Number(kost.harga) === getMin('harga') && kostList.length > 1 && <span className="badge-green ml-2 text-[10px]">Termurah</span>}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Star className={`w-4 h-4 ${Number(kost.avg_rating) === getMax('avg_rating') && kostList.length > 1 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                      <span className="text-sm font-medium">{kost.avg_rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            {kostList.length >= 2 && (
              <div className="card-premium overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-500 w-40">Kriteria</th>
                      {kostList.map(k => (
                        <th key={k.id} className="text-center p-4 font-bold text-gray-900">{k.nama}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-4 font-medium text-gray-600">Harga</td>
                      {kostList.map(k => (
                        <td key={k.id} className={`p-4 text-center font-semibold ${Number(k.harga) === getMin('harga') ? 'text-accent-600' : 'text-gray-700'}`}>
                          {formatRupiah(k.harga)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-600">Rating</td>
                      {kostList.map(k => (
                        <td key={k.id} className={`p-4 text-center font-semibold ${Number(k.avg_rating) === getMax('avg_rating') ? 'text-amber-600' : 'text-gray-700'}`}>
                          ★ {k.avg_rating}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-600">Ulasan</td>
                      {kostList.map(k => (
                        <td key={k.id} className="p-4 text-center text-gray-700">{k.total_review}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-600">Alamat</td>
                      {kostList.map(k => (
                        <td key={k.id} className="p-4 text-center text-gray-600 text-xs">{k.alamat}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-600">Fasilitas</td>
                      {kostList.map(k => (
                        <td key={k.id} className="p-4">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {k.fasilitas?.map((f, i) => (
                              <span key={i} className="badge-blue text-[10px]">{f}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;