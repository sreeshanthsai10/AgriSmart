import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Clock, ArrowRight, Calendar, User, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/v1/blogs');
            const data = await res.json();

            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-agri-green animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading articles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header - Matching your style */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <BookOpen className="w-8 h-8 text-agri-green" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {t('blog.title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('blog.subtitle')}
                    </p>
                </div>

                {/* Featured Article - Matching your card style */}
                {blogs[0] && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-agri-green rounded-full"></span>
                            Featured Article
                        </h2>
                        
                        <div
                            onClick={() => navigate(`/blog/${blogs[0]._id}`)}
                            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row group"
                        >
                            <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                                <img
                                    src={blogs[0].image ? `${BASE_URL}${blogs[0].image}` : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'}
                                    alt={blogs[0].title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-agri-green text-white text-xs font-medium rounded-full">
                                        Featured
                                    </span>
                                </div>
                            </div>
                            
                            <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(blogs[0].createdAt).toDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {Math.ceil(blogs[0].content?.length / 200) || 5} min read
                                    </span>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-agri-green transition-colors">
                                    {blogs[0].title}
                                </h2>
                                
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {blogs[0].excerpt}
                                </p>
                                
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-agri-green" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">AgriSmart Team</p>
                                        <p className="text-xs text-gray-500">Agricultural Experts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Latest Articles Grid */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-agri-green rounded-full"></span>
                        Latest Articles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                onClick={() => navigate(`/blog/${blog._id}`)}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={blog.image ? `${BASE_URL}${blog.image}` : 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=400'}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(blog.createdAt).toDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {Math.ceil(blog.content?.length / 200) || 5} min read
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-agri-green transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                        {blog.excerpt}
                                    </p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/blog/${blog._id}`);
                                        }}
                                        className="inline-flex items-center gap-1.5 text-agri-green font-semibold text-sm hover:gap-2 transition-all group/btn"
                                    >
                                        {t('blog.readArticle')}
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {blogs.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No Articles Yet</h3>
                            <p className="text-gray-500">Check back soon for farming tips and agricultural insights.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Blog;