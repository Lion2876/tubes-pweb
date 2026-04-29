const pool = require('../config/db');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [[kostCount]] = await pool.execute('SELECT COUNT(*) AS total FROM kost');
    const [[userCount]] = await pool.execute('SELECT COUNT(*) AS total FROM users');
    const [[reviewCount]] = await pool.execute('SELECT COUNT(*) AS total FROM review');
    const [[wishlistCount]] = await pool.execute('SELECT COUNT(*) AS total FROM wishlist');
    res.json({
      totalKost: kostCount.total,
      totalUsers: userCount.total,
      totalReviews: reviewCount.total,
      totalWishlists: wishlistCount.total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Tidak bisa menghapus akun sendiri' });
    }
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/users/:id/role — change user role
exports.changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Tidak bisa mengubah role sendiri' });
    }
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid. Pilih admin atau user.' });
    }
    const [result] = await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json({ message: `Role berhasil diubah menjadi ${role}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/reviews
exports.getAllReviews = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.rating, r.komentar, r.created_at,
              u.nama AS user_nama, u.email AS user_email,
              k.nama AS kost_nama
       FROM review r
       JOIN users u ON r.user_id = u.id
       JOIN kost k ON r.kost_id = k.id
       ORDER BY r.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
