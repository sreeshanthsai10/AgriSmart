const express = require('express');
const router = express.Router();

const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs
} = require('../controllers/blogController');

const { protect } = require('../middleware/auth');

//  ADD THIS
const upload = require('../middleware/upload');

//  PUBLIC ROUTES
router.get('/', getBlogs);

//  IMPORTANT ORDER FIX
router.get('/my', protect, getMyBlogs);
router.get('/:id', getBlog);

//  PRIVATE ROUTES
router.post('/', protect, upload.single('image'), createBlog); 
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;