const pool = require('../config/db');

// GET /api/fasilitas
exports.getAllFasilitas = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM fasilitas ORDER BY nama');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
