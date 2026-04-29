import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Search,
  title = 'Tidak ada data',
  description = 'Data yang Anda cari tidak ditemukan.',
  actionText,
  actionLink,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
    <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-gray-300" />
    </div>
    <h3 className="text-lg font-semibold text-gray-600 mb-1">{title}</h3>
    <p className="text-sm text-gray-400 text-center max-w-sm">{description}</p>
    {actionText && actionLink && (
      <Link
        to={actionLink}
        className="btn-primary mt-6 text-sm"
      >
        {actionText}
      </Link>
    )}
  </div>
);

export default EmptyState;
