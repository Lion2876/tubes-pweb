import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, Home, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Selamat datang, ${user.nama}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50 relative overflow-hidden">
        {/* Decorative elements for form side */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="w-full max-w-md animate-fade-in-up relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Info<span className="text-primary-600">kost</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Selamat Datang!</h1>
            <p className="text-gray-500">Masuk ke akunmu untuk melanjutkan pencarian kost</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input type="email" className="input-modern !pl-11 focus:ring-primary-500/20" placeholder="nama@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input type={showPassword ? 'text' : 'password'} className="input-modern !pl-11 !pr-11 focus:ring-primary-500/20" placeholder="Masukkan password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">Lupa Password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3 text-base !mt-6 group">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Masuk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Daftar sekarang</Link>
          </p>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/10 animate-float blur-xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/10 animate-float blur-xl" style={{ animationDelay: '1s' }} />
          {/* Abstract geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-tr from-white/5 to-white/20 backdrop-blur-md rounded-2xl rotate-12 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Selamat Datang Kembali</h2>
          <p className="text-blue-100 text-lg leading-relaxed opacity-90">Temukan kost impianmu di Bengkulu dengan mudah dan cepat. Ribuan pilihan menunggumu.</p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">10+</div>
              <div className="text-xs text-blue-200">Kost Terverifikasi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">100+</div>
              <div className="text-xs text-blue-200">Pengguna Aktif</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;