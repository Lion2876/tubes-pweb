const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/user/me', verifyToken, reviewController.getUserReviews);
router.delete('/user/:id', verifyToken, reviewController.deleteUserReview);

router.get('/:kostId', reviewController.getReviewsByKost);
router.post('/:kostId', verifyToken, reviewController.addReview);
router.delete('/:id', verifyToken, isAdmin, reviewController.deleteReview);

module.exports = router;