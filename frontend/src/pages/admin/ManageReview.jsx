import { useState, useEffect } from 'react';
import { Trash2, Star, MessageSquare } from 'lucide-react';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import StarRating from '../../components/StarRating';
import Swal from 'sweetalert2';

const ManageReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get('/admin/reviews');
      setReviews(data);
    } catch (err) {
      console.error('Fetch reviews error:', err);
      toast.error('Gagal memuat data review: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const deleteReview = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Review?',
      text: 'Yakin ingin menghapus review ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: '#ffffff',
      borderRadius: '1rem',
      customClass: {
        popup: 'rounded-2xl shadow-xl',
        confirmButton: 'rounded-lg px-6 py-2.5 font-semibold shadow-md',
        cancelButton: 'rounded-lg px-6 py-2.5 font-semibold shadow-sm'
      }
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/review/${id}`);
        Swal.fire({
          title: 'Terhapus!',
          text: 'Review berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#8b5cf6',
          customClass: { confirmButton: 'rounded-lg px-6 py-2.5 font-semibold' }
        });
        fetchReviews();
      } catch {
        toast.error('Gagal menghapus review');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Kelola Review</h2>
        <span className="badge-blue">{reviews.length} review</span>
      </div>

      <div className="card-premium overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 font-semibold text-gray-500">ID</th>
              <th className="p-3 font-semibold text-gray-500">User</th>
              <th className="p-3 font-semibold text-gray-500">Kost</th>
              <th className="p-3 font-semibold text-gray-500">Rating</th>
              <th className="p-3 font-semibold text-gray-500">Komentar</th>
              <th className="p-3 font-semibold text-gray-500">Tanggal</th>
              <th className="p-3 font-semibold text-gray-500 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map(rev => (
              <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 text-gray-400">#{rev.id}</td>
                <td className="p-3">
                  <div>
                    <p className="font-medium text-gray-900">{rev.user_nama}</p>
                    <p className="text-xs text-gray-400">{rev.user_email}</p>
                  </div>
                </td>
                <td className="p-3 font-medium text-primary-600">{rev.kost_nama}</td>
                <td className="p-3"><StarRating value={rev.rating} readonly size="sm" /></td>
                <td className="p-3 text-gray-600 max-w-[250px]">
                  <p className="line-clamp-2">{rev.komentar}</p>
                </td>
                <td className="p-3 text-gray-400 text-xs whitespace-nowrap">{new Date(rev.created_at).toLocaleDateString('id-ID')}</td>
                <td className="p-3 text-right">
                  <button onClick={() => deleteReview(rev.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-10 text-gray-400">Memuat...</div>}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-10">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400">Belum ada review</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReview;
