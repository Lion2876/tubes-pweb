import { useState, useEffect } from 'react';
import { Trash2, Shield, User, ChevronDown, RefreshCw } from 'lucide-react';
import API from '../../utils/api';
import { toast } from 'react-toastify';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingRole, setChangingRole] = useState(null); // user id being changed

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch {
      toast.error('Gagal memuat data user');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus user "${nama}"?\nSemua review dan wishlist user ini juga akan terhapus.`)) {
      try {
        await API.delete(`/admin/users/${id}`);
        toast.success('User berhasil dihapus');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus user');
      }
    }
  };

  const changeRole = async (id, newRole, nama) => {
    const confirmMsg = newRole === 'admin'
      ? `Jadikan "${nama}" sebagai Admin? User akan mendapat akses penuh ke dashboard admin.`
      : `Ubah "${nama}" menjadi User biasa? Akses admin akan dicabut.`;

    if (window.confirm(confirmMsg)) {
      setChangingRole(id);
      try {
        await API.patch(`/admin/users/${id}/role`, { role: newRole });
        toast.success(`Role ${nama} berhasil diubah menjadi ${newRole} ✅`);
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal mengubah role');
      }
      setChangingRole(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Kelola User</h2>
        <div className="flex items-center gap-2">
          <span className="badge-blue">{users.length} user</span>
          <button onClick={() => { setLoading(true); fetchUsers(); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 mb-4 text-sm text-primary-700 flex items-start gap-2">
        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>Anda dapat mengubah role user dengan klik dropdown di kolom Role. Admin memiliki akses penuh ke dashboard ini.</p>
      </div>

      <div className="card-premium overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 font-semibold text-gray-500">ID</th>
              <th className="p-3 font-semibold text-gray-500">Nama</th>
              <th className="p-3 font-semibold text-gray-500">Email</th>
              <th className="p-3 font-semibold text-gray-500">Role</th>
              <th className="p-3 font-semibold text-gray-500">Terdaftar</th>
              <th className="p-3 font-semibold text-gray-500 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors animate-fade-in">
                <td className="p-3 text-gray-400 font-mono">#{u.id}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      u.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'gradient-primary'
                    }`}>
                      <span className="text-white text-sm font-bold">{u.nama?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium text-gray-900">{u.nama}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-500">{u.email}</td>
                <td className="p-3">
                  {/* Role dropdown — selectable */}
                  <div className="relative inline-block">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value, u.nama)}
                      disabled={changingRole === u.id}
                      className={`appearance-none cursor-pointer pr-7 pl-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 border-purple-200 focus:ring-purple-200'
                          : 'bg-primary-100 text-primary-700 border-primary-200 focus:ring-primary-200'
                      } ${changingRole === u.id ? 'opacity-50' : 'hover:shadow-md'}`}
                    >
                      <option value="user">👤 User</option>
                      <option value="admin">🛡️ Admin</option>
                    </select>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-gray-400" />
                    {changingRole === u.id && (
                      <div className="absolute -right-6 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => deleteUser(u.id, u.nama)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                    title="Hapus User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-center py-10 text-gray-400">Memuat data user...</div>}
        {!loading && users.length === 0 && <div className="text-center py-10 text-gray-400">Belum ada user terdaftar</div>}
      </div>
    </div>
  );
};

export default ManageUser;
