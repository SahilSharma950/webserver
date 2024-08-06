const express = require('express');
const router = express.Router();
const blogControllers = require('../controllers/blog');

// Define routes
router.post("/create", blogControllers.createBlog);
router.get("/", blogControllers.getAllBlogs);
router.get("/recent-posts", blogControllers.recentPosts); // This should work correctly now
router.get("/blog/:id", blogControllers.getBlogById);
router.delete("/:id", blogControllers.deleteBlogbyId);
router.put("/blog/:id", blogControllers.updateBlogById);

module.exports = router;
