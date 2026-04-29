const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, wishlistController.getUserWishlist);
router.post('/:kostId', verifyToken, wishlistController.addToWishlist);
router.delete('/:kostId', verifyToken, wishlistController.removeFromWishlist);

module.exports = router;