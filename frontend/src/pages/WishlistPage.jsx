import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import API from '../utils/api';
import KostCard from '../components/KostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const WishlistPage = () => {
  const [kosts, setKosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await API.get('/wishlist');
        setKosts(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchWishlist();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-br from-red-50 via-rose-100 to-pink-50 opacity-70 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-red-200 to-pink-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-rose-200 to-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-red-100/50">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">Wishlist Saya</h1>
                <p className="text-sm font-medium text-red-400 mt-0.5">{kosts.length} kost tersimpan</p>
              </div>
            </div>
          </div>
          <Link to="/" className="px-4 py-2 bg-white text-red-500 font-semibold rounded-xl border border-red-100 shadow-sm hover:bg-red-50 hover:shadow-md transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Cari Kost
          </Link>
        </div>

        {/* Content */}
        {kosts.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Wishlist masih kosong"
            description="Simpan kost favorit Anda dengan menekan tombol hati pada card kost"
            actionText="Jelajahi Kost"
            actionLink="/"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {kosts.map((kost, index) => (
              <KostCard key={kost.id} kost={kost} style={{ animationDelay: `${index * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;