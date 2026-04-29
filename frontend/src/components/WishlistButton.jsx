import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const WishlistButton = ({ kostId, size = 'sm' }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Check wishlist status on mount
  useEffect(() => {
    if (!user) return;
    const checkWishlist = async () => {
      try {
        const { data } = await API.get('/wishlist');
        const found = data.some(k => k.id === kostId);
        setIsWishlisted(found);
      } catch {
        // silent fail
      }
    };
    checkWishlist();
  }, [user, kostId]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Silakan login untuk menyimpan ke wishlist');
      return;
    }
    setLoading(true);
    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${kostId}`);
        setIsWishlisted(false);
        toast.success('Dihapus dari wishlist');
      } else {
        await API.post(`/wishlist/${kostId}`);
        setIsWishlisted(true);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
        toast.success('Ditambahkan ke wishlist ❤️');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah wishlist');
    }
    setLoading(false);
  };

  const sizeClass = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`${sizeClass} rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center
        transition-all duration-300 hover:scale-110 active:scale-90
        ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}
        ${animate ? 'animate-bounce-in' : ''}
        ${loading ? 'opacity-50' : ''}
      `}
      title={isWishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
    >
      <Heart
        className={`${iconSize} transition-all duration-300 ${isWishlisted ? 'fill-red-500' : ''}`}
      />
    </button>
  );
};

export default WishlistButton;