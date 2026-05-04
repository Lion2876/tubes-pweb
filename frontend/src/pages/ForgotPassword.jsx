import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, Home, KeyRound, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordBaru.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }
    if (passwordBaru !== konfirmasi) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/reset-password', { email, passwordBaru });
      toast.success(data.message);
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mereset password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="w-full max-w-md animate-fade-in-up relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Info<span className="text-primary-600">kost</span></span>
          </div>

          {!success ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Lupa Password?</h1>
                <p className="text-gray-500">Masukkan email dan password baru untuk mereset akun Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      className="input-modern !pl-11 focus:ring-primary-500/20"
                      placeholder="nama@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-modern !pl-11 !pr-11 focus:ring-primary-500/20"
                      placeholder="Minimal 6 karakter"
                      required
                      minLength={6}
                      value={passwordBaru}
                      onChange={(e) => setPasswordBaru(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className="input-modern !pl-11 !pr-11 focus:ring-primary-500/20"
                      placeholder="Ulangi password baru"
                      required
                      value={konfirmasi}
                      onChange={(e) => setKonfirmasi(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordBaru && konfirmasi && passwordBaru !== konfirmasi && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Password tidak cocok
                    </p>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3 text-base !mt-6 group">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Reset Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Berhasil Direset!</h1>
              <p className="text-gray-500 mb-6">Silakan login menggunakan password baru Anda.</p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2 !py-3 !px-8">
                Masuk Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke halaman login
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/10 animate-float blur-xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/10 animate-float blur-xl" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-tr from-white/5 to-white/20 backdrop-blur-md rounded-2xl rotate-12 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Reset Password</h2>
          <p className="text-blue-100 text-lg leading-relaxed opacity-90">Jangan khawatir, kami bantu Anda mengatur ulang password akun Anda dengan mudah dan aman.</p>
          <div className="mt-10 bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-white/80" />
              <div>
                <p className="font-semibold text-white text-sm">Tips Keamanan</p>
                <p className="text-xs text-blue-200 mt-0.5">Gunakan kombinasi huruf besar, kecil, angka, dan simbol untuk password yang kuat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Shield = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default ForgotPassword;
