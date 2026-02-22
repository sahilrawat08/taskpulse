const express = require('express');
const { getComments, addComment, deleteComment } = require('../controllers/commentControlller');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getComments)
    .post(protect, addComment);

router.route('/:id')
    .delete(protect, deleteComment);

module.exports = router;
