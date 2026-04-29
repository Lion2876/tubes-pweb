const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const kostController = require('../controllers/kostController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/', kostController.getAllKost);
router.get('/:id', kostController.getKostById);
router.post('/', verifyToken, isAdmin, upload.single('gambar'), kostController.createKost);
router.put('/:id', verifyToken, isAdmin, upload.single('gambar'), kostController.updateKost);
router.delete('/:id', verifyToken, isAdmin, kostController.deleteKost);

module.exports = router;