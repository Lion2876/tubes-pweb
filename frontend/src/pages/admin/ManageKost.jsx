import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Pencil, Trash2, X, Upload, MapPin, Eye } from 'lucide-react';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import { formatRupiah, getImageUrl } from '../../utils/helpers';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* Component to handle map clicks */
const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat.toFixed(8), e.latlng.lng.toFixed(8));
    },
  });
  return null;
};

const ManageKost = () => {
  const [kosts, setKosts] = useState([]);
  const [fasilitasList, setFasilitasList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editKost, setEditKost] = useState(null);
  const [formData, setFormData] = useState({
    nama: '', harga: '', alamat: '', latitude: '-3.7982', longitude: '102.2600', deskripsi: '', fasilitas: []
  });
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const fetchKosts = async () => {
    try {
      const { data } = await API.get('/kost');
      setKosts(data);
    } catch { toast.error('Gagal memuat data'); }
  };

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

  useEffect(() => { fetchKosts(); fetchFasilitas(); }, []);

  const resetForm = () => {
    setFormData({ nama: '', harga: '', alamat: '', latitude: '-3.7982', longitude: '102.2600', deskripsi: '', fasilitas: [] });
    setGambar(null); setPreview(null); setShowMapPicker(false);
  };

  const openCreateForm = () => { setEditKost(null); resetForm(); setShowForm(true); };

  const openEditForm = (kost) => {
    setEditKost(kost);
    setFormData({
      nama: kost.nama, harga: kost.harga, alamat: kost.alamat,
      latitude: kost.latitude || '-3.7982', longitude: kost.longitude || '102.2600',
      deskripsi: kost.deskripsi || '', fasilitas: []
    });
    setGambar(null); setPreview(getImageUrl(kost.gambar)); setShowMapPicker(false);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran gambar maksimal 5MB'); return; }
      setGambar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleFasilitas = (id) => {
    setFormData(prev => ({
      ...prev,
      fasilitas: prev.fasilitas.includes(id) ? prev.fasilitas.filter(f => f !== id) : [...prev.fasilitas, id]
    }));
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.harga || !formData.alamat.trim()) {
      toast.error('Nama, harga, dan alamat wajib diisi');
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append('nama', formData.nama.trim());
    fd.append('harga', formData.harga);
    fd.append('alamat', formData.alamat.trim());
    fd.append('latitude', formData.latitude);
    fd.append('longitude', formData.longitude);
    fd.append('deskripsi', formData.deskripsi.trim());
    formData.fasilitas.forEach(f => fd.append('fasilitas[]', f));
    if (gambar) fd.append('gambar', gambar);

    try {
      if (editKost) {
        await API.put(`/kost/${editKost.id}`, fd);
        toast.success('Kost berhasil diperbarui ✅');
      } else {
        await API.post('/kost', fd);
        toast.success('Kost berhasil ditambahkan ✅');
      }
      setShowForm(false);
      fetchKosts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data');
    }
    setLoading(false);
  };

  const deleteKost = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus "${nama}"?\nData review dan wishlist terkait juga akan terhapus.`)) {
      try {
        await API.delete(`/kost/${id}`);
        toast.success('Kost berhasil dihapus');
        fetchKosts();
      } catch { toast.error('Gagal menghapus'); }
    }
  };

  const mapCenter = [parseFloat(formData.latitude) || -3.7982, parseFloat(formData.longitude) || 102.2600];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Kelola Kost</h2>
        <button onClick={openCreateForm} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Kost
        </button>
      </div>

      {/* Table */}
      <div className="card-premium overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 font-semibold text-gray-500">Gambar</th>
              <th className="p-3 font-semibold text-gray-500">Nama</th>
              <th className="p-3 font-semibold text-gray-500">Harga</th>
              <th className="p-3 font-semibold text-gray-500">Rating</th>
              <th className="p-3 font-semibold text-gray-500">Fasilitas</th>
              <th className="p-3 font-semibold text-gray-500">Alamat</th>
              <th className="p-3 font-semibold text-gray-500 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {kosts.map(kost => (
              <tr key={kost.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <img src={getImageUrl(kost.gambar)} alt="" className="w-14 h-14 rounded-xl object-cover shadow-sm"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=56&h=56&fit=crop'; }} />
                </td>
                <td className="p-3 font-semibold text-gray-900">{kost.nama}</td>
                <td className="p-3 text-primary-600 font-bold whitespace-nowrap">{formatRupiah(kost.harga)}</td>
                <td className="p-3">
                  <span className="badge-blue">★ {kost.avg_rating}</span>
                  <span className="text-xs text-gray-400 block mt-0.5">{kost.total_review} ulasan</span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {kost.fasilitas?.slice(0, 2).map((f, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                    {kost.fasilitas?.length > 2 && <span className="text-[10px] text-gray-400">+{kost.fasilitas.length - 2}</span>}
                  </div>
                </td>
                <td className="p-3 text-gray-500 text-xs max-w-[180px] truncate">{kost.alamat}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1 justify-end">
                    <a href={`/kost/${kost.id}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="Preview">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => openEditForm(kost)} className="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteKost(kost.id, kost.nama)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {kosts.length === 0 && <div className="text-center py-10 text-gray-400">Belum ada data kost. Klik "Tambah Kost" untuk mulai.</div>}
      </div>

      {/* ===== MODAL FORM ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-premium animate-scale-in">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{editKost ? 'Edit Kost' : 'Tambah Kost Baru'}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Isi semua informasi kost dengan lengkap</p>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Kost <span className="text-red-400">*</span></label>
                <input className="input-modern" placeholder="Contoh: Kost Melati" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Harga/bulan <span className="text-red-400">*</span></label>
                  <input type="number" className="input-modern" placeholder="800000" required min="0" value={formData.harga} onChange={e => setFormData({...formData, harga: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Gambar (max 5MB)</label>
                  <label className="input-modern cursor-pointer flex items-center gap-2 text-gray-400 hover:border-primary-300 hover:bg-primary-50/30 transition-all">
                    <Upload className="w-4 h-4 flex-shrink-0" /><span className="truncate text-xs">{gambar ? gambar.name : 'Pilih foto kost'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {preview && (
                <div className="relative group">
                  <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-gray-100" />
                  <button type="button" onClick={() => { setPreview(null); setGambar(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Alamat Lengkap <span className="text-red-400">*</span></label>
                <input className="input-modern" placeholder="Jl. Melati No.10, Ratu Agung, Bengkulu" required value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} />
              </div>

              {/* Lat/Lng + Leaflet Map Picker */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Lokasi (Latitude & Longitude)</label>
                  <button type="button" onClick={() => setShowMapPicker(!showMapPicker)}
                    className={`text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                      showMapPicker ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    <MapPin className="w-3.5 h-3.5" />
                    {showMapPicker ? 'Tutup Peta' : 'Pilih dari Peta'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" step="any" className="input-modern" placeholder="Latitude" value={formData.latitude}
                    onChange={e => setFormData({...formData, latitude: e.target.value})} />
                  <input type="number" step="any" className="input-modern" placeholder="Longitude" value={formData.longitude}
                    onChange={e => setFormData({...formData, longitude: e.target.value})} />
                </div>

                {showMapPicker && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 animate-fade-in">
                    <div className="bg-primary-50 px-3 py-2 text-xs text-primary-600 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Klik pada peta untuk menentukan lokasi kost
                    </div>
                    <div style={{ height: '250px' }}>
                      <MapContainer center={mapCenter} zoom={14} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true} key={`${mapCenter[0]}-${mapCenter[1]}`}>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <LocationPicker onLocationSelect={handleLocationSelect} />
                        {formData.latitude && formData.longitude && (
                          <Marker position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} />
                        )}
                      </MapContainer>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Deskripsi</label>
                <textarea rows="3" className="input-modern resize-none" placeholder="Deskripsi kost, lingkungan, keunggulan, dll." value={formData.deskripsi}
                  onChange={e => setFormData({...formData, deskripsi: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Fasilitas ({formData.fasilitas.length} dipilih)</label>
                <div className="flex flex-wrap gap-2">
                  {fasilitasList.map(f => (
                    <button type="button" key={f.id} onClick={() => toggleFasilitas(f.id)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                        formData.fasilitas.includes(f.id)
                          ? 'bg-primary-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>{f.nama}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white rounded-b-2xl">
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editKost ? 'Perbarui Kost' : 'Tambah Kost')}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Batal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageKost;