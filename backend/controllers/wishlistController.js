const pool = require('../config/db');

// GET /api/wishlist (user)
exports.getUserWishlist = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.execute(
      `SELECT k.*, GROUP_CONCAT(f.nama) AS fasilitas_nama,
        COALESCE(ROUND(AVG(r.rating),1),0) AS avg_rating,
        COUNT(DISTINCT r.id) AS total_review
       FROM wishlist w
       JOIN kost k ON w.kost_id = k.id
       LEFT JOIN kost_fasilitas kf ON k.id = kf.kost_id
       LEFT JOIN fasilitas f ON kf.fasilitas_id = f.id
       LEFT JOIN review r ON k.id = r.kost_id
       WHERE w.user_id = ?
       GROUP BY k.id`,
      [userId]
    );
    const result = rows.map((kost) => ({
      ...kost,
      fasilitas: kost.fasilitas_nama ? kost.fasilitas_nama.split(',') : [],
      total_review: Number(kost.total_review),
      avg_rating: Number(kost.avg_rating),
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/wishlist/:kostId
exports.addToWishlist = async (req, res) => {
  const { kostId } = req.params;
  const userId = req.user.id;
  try {
    await pool.execute('INSERT INTO wishlist (user_id, kost_id) VALUES (?,?)', [userId, kostId]);
    res.status(201).json({ message: 'Kost ditambah ke wishlist' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Sudah ada di wishlist' });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/wishlist/:kostId
exports.removeFromWishlist = async (req, res) => {
  const { kostId } = req.params;
  const userId = req.user.id;
  try {
    await pool.execute('DELETE FROM wishlist WHERE user_id=? AND kost_id=?', [userId, kostId]);
    res.json({ message: 'Dihapus dari wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};