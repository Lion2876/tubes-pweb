import { Home } from 'lucide-react';

const LoadingSpinner = ({ message = 'Memuat data...' }) => (
  <div className="flex flex-col justify-center items-center py-16 gap-4 animate-fade-in">
    <div className="relative">
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-slow shadow-lg">
        <Home className="w-8 h-8 text-white" />
      </div>
      <div className="absolute -inset-2 rounded-2xl border-2 border-primary-300 animate-ping opacity-20" />
    </div>
    <p className="text-sm text-gray-400 font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;