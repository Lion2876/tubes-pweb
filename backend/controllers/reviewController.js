const pool = require('../config/db');

// GET /api/review/:kostId
exports.getReviewsByKost = async (req, res) => {
  const { kostId } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.rating, r.komentar, r.created_at, u.nama AS user_nama
       FROM review r
       JOIN users u ON r.user_id = u.id
       WHERE r.kost_id = ?
       ORDER BY r.created_at DESC`,
      [kostId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/review/:kostId (user)
exports.addReview = async (req, res) => {
  const { kostId } = req.params;
  const { rating, komentar } = req.body;
  const userId = req.user.id;
  try {
    // Cegah duplikat review user-kost (opsional: boleh hanya satu)
    const [existing] = await pool.execute(
      'SELECT id FROM review WHERE user_id=? AND kost_id=?',
      [userId, kostId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Anda sudah memberi review untuk kost ini' });
    }
    await pool.execute(
      'INSERT INTO review (user_id, kost_id, rating, komentar) VALUES (?,?,?,?)',
      [userId, kostId, rating, komentar]
    );
    res.status(201).json({ message: 'Review berhasil ditambah' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/review/:id (admin)
exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM review WHERE id=?', [id]);
    res.json({ message: 'Review dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/review/user/me
exports.getUserReviews = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.rating, r.komentar, r.created_at, k.nama AS kost_nama, k.id AS kost_id
       FROM review r
       JOIN kost k ON r.kost_id = k.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/review/user/:id
exports.deleteUserReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const [check] = await pool.execute('SELECT user_id FROM review WHERE id=?', [id]);
    if (check.length === 0) return res.status(404).json({ message: 'Review tidak ditemukan' });
    if (check[0].user_id !== userId) return res.status(403).json({ message: 'Akses ditolak' });

    await pool.execute('DELETE FROM review WHERE id=?', [id]);
    res.json({ message: 'Review berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};