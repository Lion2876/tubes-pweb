const pool = require('../config/db');

// GET /api/kost
exports.getAllKost = async (req, res) => {
  const { search, minPrice, maxPrice, fasilitas, sortBy } = req.query;
  let sql = `
    SELECT k.*,
      GROUP_CONCAT(f.nama ORDER BY f.nama) AS fasilitas_nama,
      COUNT(DISTINCT r.id) AS total_review,
      COALESCE(ROUND(AVG(r.rating),1), 0) AS avg_rating
    FROM kost k
    LEFT JOIN kost_fasilitas kf ON k.id = kf.kost_id
    LEFT JOIN fasilitas f ON kf.fasilitas_id = f.id
    LEFT JOIN review r ON k.id = r.kost_id
  `;
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(k.nama LIKE ? OR k.alamat LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (minPrice) {
    conditions.push('k.harga >= ?');
    params.push(minPrice);
  }
  if (maxPrice) {
    conditions.push('k.harga <= ?');
    params.push(maxPrice);
  }
  if (fasilitas) {
    const ids = fasilitas.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
    if (ids.length > 0) {
      const placeholders = ids.map(() => '?').join(',');
      conditions.push(`k.id IN (SELECT kost_id FROM kost_fasilitas WHERE fasilitas_id IN (${placeholders}))`);
      params.push(...ids);
    }
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' GROUP BY k.id';

  switch (sortBy) {
    case 'harga_desc':
      sql += ' ORDER BY k.harga DESC';
      break;
    case 'rating':
      sql += ' ORDER BY avg_rating DESC';
      break;
    case 'populer':
      sql += ' ORDER BY total_review DESC';
      break;
    default:
      sql += ' ORDER BY k.harga ASC';
  }

  try {
    const [rows] = await pool.query(sql, params);
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

// GET /api/kost/:id
exports.getKostById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT k.*,
        GROUP_CONCAT(distinct f.nama) AS fasilitas_nama,
        COUNT(DISTINCT r.id) AS total_review,
        COALESCE(ROUND(AVG(r.rating),1),0) AS avg_rating
      FROM kost k
      LEFT JOIN kost_fasilitas kf ON k.id = kf.kost_id
      LEFT JOIN fasilitas f ON kf.fasilitas_id = f.id
      LEFT JOIN review r ON k.id = r.kost_id
      WHERE k.id = ?
      GROUP BY k.id`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Kost tidak ditemukan' });
    const kost = {
      ...rows[0],
      fasilitas: rows[0].fasilitas_nama ? rows[0].fasilitas_nama.split(',') : [],
      total_review: Number(rows[0].total_review),
      avg_rating: Number(rows[0].avg_rating),
    };
    res.json(kost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/kost (admin)
exports.createKost = async (req, res) => {
  const { nama, harga, alamat, latitude, longitude, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : 'default.jpg';

  // Validate required fields
  if (!nama || !harga || !alamat) {
    return res.status(400).json({ message: 'Nama, harga, dan alamat wajib diisi' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO kost (nama, harga, alamat, latitude, longitude, deskripsi, gambar) VALUES (?,?,?,?,?,?,?)',
      [nama, harga, alamat, latitude || null, longitude || null, deskripsi || '', gambar]
    );
    const kostId = result.insertId;

    // Handle fasilitas — can come as fasilitas[] (array) or fasilitas (single/string)
    let fasilitasIds = [];
    if (req.body['fasilitas[]']) {
      const raw = req.body['fasilitas[]'];
      fasilitasIds = Array.isArray(raw) ? raw.map(Number) : [Number(raw)];
    } else if (req.body.fasilitas) {
      const raw = req.body.fasilitas;
      fasilitasIds = Array.isArray(raw) ? raw.map(Number) : [Number(raw)];
    }

    fasilitasIds = fasilitasIds.filter(n => !isNaN(n) && n > 0);

    if (fasilitasIds.length > 0) {
      const values = fasilitasIds.map(fId => [kostId, fId]);
      await pool.query('INSERT INTO kost_fasilitas (kost_id, fasilitas_id) VALUES ?', [values]);
    }

    res.status(201).json({ message: 'Kost berhasil ditambah', kostId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/kost/:id (admin)
exports.updateKost = async (req, res) => {
  const { id } = req.params;
  const { nama, harga, alamat, latitude, longitude, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : undefined;
  const fields = [];
  const params = [];

  if (nama) { fields.push('nama=?'); params.push(nama); }
  if (harga) { fields.push('harga=?'); params.push(harga); }
  if (alamat) { fields.push('alamat=?'); params.push(alamat); }
  if (latitude !== undefined && latitude !== '') { fields.push('latitude=?'); params.push(latitude); }
  if (longitude !== undefined && longitude !== '') { fields.push('longitude=?'); params.push(longitude); }
  if (deskripsi !== undefined) { fields.push('deskripsi=?'); params.push(deskripsi); }
  if (gambar) { fields.push('gambar=?'); params.push(gambar); }

  try {
    if (fields.length > 0) {
      params.push(id);
      await pool.execute(`UPDATE kost SET ${fields.join(',')} WHERE id=?`, params);
    }

    // Handle fasilitas — can come as fasilitas[] or fasilitas
    let fasilitasIds = null;
    if (req.body['fasilitas[]']) {
      const raw = req.body['fasilitas[]'];
      fasilitasIds = Array.isArray(raw) ? raw.map(Number) : [Number(raw)];
    } else if (req.body.fasilitas) {
      const raw = req.body.fasilitas;
      fasilitasIds = Array.isArray(raw) ? raw.map(Number) : [Number(raw)];
    }

    if (fasilitasIds !== null) {
      fasilitasIds = fasilitasIds.filter(n => !isNaN(n) && n > 0);
      await pool.execute('DELETE FROM kost_fasilitas WHERE kost_id=?', [id]);
      if (fasilitasIds.length > 0) {
        const values = fasilitasIds.map(fId => [parseInt(id), fId]);
        await pool.query('INSERT INTO kost_fasilitas (kost_id, fasilitas_id) VALUES ?', [values]);
      }
    }

    res.json({ message: 'Kost berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/kost/:id (admin)
exports.deleteKost = async (req, res) => {
  const { id } = req.params;
  try {
    const [check] = await pool.execute('SELECT id FROM kost WHERE id=?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ message: 'Kost tidak ditemukan' });
    }
    await pool.execute('DELETE FROM kost WHERE id=?', [id]);
    res.json({ message: 'Kost berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};