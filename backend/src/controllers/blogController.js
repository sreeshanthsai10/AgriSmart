
const Blog = require('../models/Blog');

//  CREATE BLOG
const createBlog = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        //  HANDLE IMAGE FROM MULTER
        let imagePath = null;

        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const blog = await Blog.create({
            title: title.trim(),
            content,
            tags,
            image: imagePath, //  SAVE IMAGE PATH
            author: req.user._id
        });

        res.status(201).json({ success: true, blog });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//  GET ALL BLOGS
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 });

        res.json({ success: true, blogs });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};

//  GET SINGLE BLOG
const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.json({ success: true, blog });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};

//  GET MY BLOGS
const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ success: true, blogs });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};

//  UPDATE BLOG
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // 🔒 Only owner can update
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({ success: true, blog: updatedBlog });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};

//  DELETE BLOG
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        await blog.deleteOne();

        res.json({ success: true, message: "Blog deleted" });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    getMyBlogs,
    updateBlog,
    deleteBlog
};