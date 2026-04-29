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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wishlist Saya</h1>
                <p className="text-sm text-gray-500">{kosts.length} kost tersimpan</p>
              </div>
            </div>
          </div>
          <Link to="/" className="btn-secondary text-sm flex items-center gap-2">
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