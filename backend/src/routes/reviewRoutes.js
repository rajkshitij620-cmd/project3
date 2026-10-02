const express = require('express');
const router = express.Router();
const { createReview, getSalonReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.post('/', protect, authorize('customer'), createReview);
router.get('/salon/:id', getSalonReviews);

module.exports = router;
