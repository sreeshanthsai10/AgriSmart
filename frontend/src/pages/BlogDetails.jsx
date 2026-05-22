import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen, Loader } from 'lucide-react';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        fetchBlog();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/blogs/${id}`);
            const data = await res.json();

            if (data.success) {
                setBlog(data.blog);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-agri-green animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading article...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Article Not Found</h3>
                    <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/blog')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-agri-green text-white rounded-xl font-semibold hover:bg-agri-dark transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/blog')}
                    className="inline-flex items-center gap-2 text-agri-green font-semibold hover:gap-3 transition-all mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Blogs
                </button>

                {/* Article Card */}
                <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Hero Image */}
                    <div className="relative h-80 lg:h-96 overflow-hidden">
                        <img
                            src={
                                blog.image
                                    ? `${BASE_URL}${blog.image}`
                                    : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200'
                            }
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        {/* Title overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                                {blog.title}
                            </h1>
                            
                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(blog.createdAt).toDateString()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {Math.ceil(blog.content?.length / 200) || 5} min read
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    AgriSmart Team
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-10">
                        
                        {/* Author & Share Bar */}
                        <div className="flex items-center justify-between pb-8 mb-8 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <User className="w-6 h-6 text-agri-green" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">AgriSmart Team</p>
                                    <p className="text-sm text-gray-500">Agricultural Experts & Researchers</p>
                                </div>
                            </div>
                            
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                        </div>

                        {/* Article Content */}
                        <div className="prose max-w-none">
                            <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                                {blog.content}
                            </div>
                        </div>

                        {/* Tags / Category if available */}
                        {blog.category && (
                            <div className="mt-10 pt-8 border-t border-gray-100">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-4 py-2 bg-green-50 text-agri-green rounded-full text-sm font-medium">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Bottom Navigation */}
                        <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={() => navigate('/blog')}
                                className="inline-flex items-center gap-2 text-agri-green font-semibold hover:gap-3 transition-all group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                Back to All Articles
                            </button>
                            
                            <button
                                onClick={() => navigate('/blog')}
                                className="px-6 py-3 bg-agri-green text-white rounded-xl font-semibold hover:bg-agri-dark transition-colors shadow-md"
                            >
                                More Articles
                            </button>
                        </div>

                    </div>
                </article>

                {/* Related Articles Section (optional placeholder) */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-agri-green rounded-full"></span>
                        Related Articles
                    </h2>
                    <p className="text-gray-500 text-center py-8 bg-white rounded-2xl border border-gray-100">
                        More articles coming soon...
                    </p>
                </div>

            </div>
        </div>
    );
};

export default BlogDetails;