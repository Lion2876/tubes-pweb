import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Bath, Wind } from 'lucide-react';
import WishlistButton from './WishlistButton';
import { formatRupiah, getImageUrl } from '../utils/helpers';

const facilityIcons = {
  'WiFi': Wifi,
  'AC': Wind,
  'Parkir Motor': Car,
  'Parkir Mobil': Car,
  'Kamar Mandi Dalam': Bath,
};

const KostCard = ({ kost, style }) => {
  const getLabel = () => {
    if (kost.harga < 700000) return { text: 'Murah', class: 'bg-emerald-500' };
    if (kost.avg_rating >= 4.5) return { text: 'Rekomendasi', class: 'bg-amber-500' };
    if (kost.total_review >= 5) return { text: 'Populer', class: 'bg-rose-500' };
    return null;
  };

  const label = getLabel();

  return (
    <div
      className="card-gradient-border group overflow-hidden animate-fade-in-up"
      style={style}
    >
      {/* Image container */}
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(kost.gambar)}
          alt={kost.nama}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop';
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Label badge */}
        {label && (
          <span className={`absolute top-3 left-3 ${label.class} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
            {label.text}
          </span>
        )}

        {/* Wishlist button */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton kostId={kost.id} />
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-white/95 backdrop-blur-sm text-primary-700 font-bold text-sm px-3 py-1.5 rounded-lg shadow-md">
            {formatRupiah(kost.harga)}<span className="text-gray-500 font-normal text-xs">/bln</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {kost.nama}
        </h3>

        <div className="flex items-center gap-1.5 mt-1.5 text-gray-500">
          <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{kost.alamat}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{kost.avg_rating}</span>
          </div>
          <span className="text-xs text-gray-400">({kost.total_review} ulasan)</span>
        </div>

        {/* Fasilitas */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {kost.fasilitas?.slice(0, 3).map((f, idx) => {
            const Icon = facilityIcons[f];
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-primary-50 text-primary-600 text-xs px-2 py-1 rounded-lg font-medium"
              >
                {Icon && <Icon className="w-3 h-3" />}
                {f}
              </span>
            );
          })}
          {kost.fasilitas?.length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-1">
              +{kost.fasilitas.length - 3} lagi
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={`/kost/${kost.id}`}
          className="mt-4 block text-center btn-primary text-sm !rounded-xl"
        >
          Lihat Detail
        </a>
      </div>
    </div>
  );
};

export default KostCard;