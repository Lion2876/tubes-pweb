import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Heart, Search, GitCompareArrows } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Gradient top strip */}
      <div className="h-1 gradient-mixed" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Info<span className="text-violet-400">kost</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Platform pencarian kost terpercaya di Bengkulu. Temukan hunian nyaman dengan harga terjangkau.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {['📘', '📷', '🐦', '📺'].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-gray-800 hover:bg-violet-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 text-sm"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Menu</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Home className="w-3.5 h-3.5" /> Beranda
                </Link>
              </li>
              <li>
                <Link to="/cari" className="text-sm text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" /> Cari Kost
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-sm text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-2">
                  <GitCompareArrows className="w-3.5 h-3.5" /> Bandingkan Kost
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-sm text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5" /> Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Informasi</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-gray-400 hover:text-violet-400 transition-colors cursor-pointer">Tentang Kami</li>
              <li className="text-sm text-gray-400 hover:text-violet-400 transition-colors cursor-pointer">Kebijakan Privasi</li>
              <li className="text-sm text-gray-400 hover:text-violet-400 transition-colors cursor-pointer">Syarat & Ketentuan</li>
              <li className="text-sm text-gray-400 hover:text-violet-400 transition-colors cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Kontak</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0" />
                Bengkulu, Indonesia
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-violet-400 flex-shrink-0" />
                infokostbengkulu@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-violet-400 flex-shrink-0" />
                +62 896-7153-0066
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Infokost Bengkulu. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with Kelompok 3 di Bengkulu
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
