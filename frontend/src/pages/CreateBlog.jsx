import { useState } from 'react';
import { BookOpen, Image as ImageIcon, CheckCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const CreateBlog = () => {
    const { user, isFarmer, token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        category: 'General Farming',
        excerpt: '',
        content: ''
    });

    // NEW: image state
    const [image, setImage] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!user || (!isFarmer && user.role !== 'farmer')) {
        return <Navigate to="/dashboard" replace />;
    }

    //  UPDATED: FormData instead of JSON
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('excerpt', formData.excerpt);
            formDataToSend.append('tags', formData.category);

            if (image) {
                formDataToSend.append('image', image);
            }

            const res = await fetch('http://localhost:5000/api/v1/blogs', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem('token')}`
                },
                body: formDataToSend
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create blog');
            }

            setSuccess(true);

            setTimeout(() => {
                navigate('/blog');
            }, 2000);

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-agri-green" /> Create New Blog Post
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Share your agricultural expertise with customers and other farmers in the community.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/blog')}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium bg-white px-4 py-2 border rounded-xl"
                    >
                        Cancel
                    </button>
                </div>

                {success ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center animate-fade-in shadow-sm">
                        <CheckCircle className="w-16 h-16 text-agri-green mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Published Successfully!</h2>
                        <p className="text-gray-600">Your knowledge has been shared with the community. Redirecting to the blog platform...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 space-y-6">

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Article Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., 5 Ways to Improve Soil Hydration"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border-gray-300 rounded-xl py-3 px-4 focus:ring-agri-green focus:border-agri-green bg-gray-50 border text-lg font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border-gray-300 rounded-xl py-3 px-4 focus:ring-agri-green focus:border-agri-green bg-gray-50 border"
                                    >
                                        <option>General Farming</option>
                                        <option>Pest Control</option>
                                        <option>Water Management</option>
                                        <option>Crop Yields</option>
                                        <option>Market Strategy</option>
                                    </select>
                                </div>

                                {/* ✅ IMAGE UPLOAD (UI SAME) */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                                        <ImageIcon className="w-4 h-4 text-gray-500" /> Header Image
                                    </label>

                                    <label className="w-full border-2 border-dashed border-gray-300 rounded-xl py-2 px-4 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-colors block">
                                        <span className="text-sm text-gray-500 font-medium">
                                            {image ? image.name : "Click to upload an image"}
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Short Excerpt (Summary)</label>
                                <textarea
                                    required
                                    rows={2}
                                    maxLength={160}
                                    placeholder="A brief summary..."
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full border-gray-300 rounded-xl py-3 px-4 bg-gray-50 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Main Content</label>
                                <textarea
                                    required
                                    rows={12}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full border-gray-300 rounded-xl py-3 px-4 bg-gray-50 border"
                                />
                            </div>

                        </div>

                        <div className="bg-gray-50 px-8 py-4 border-t flex justify-end gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-agri-green text-white rounded-xl flex items-center gap-2"
                            >
                                {isSubmitting ? "Publishing..." : <><Send className="w-4 h-4" /> Publish</>}
                            </button>
                        </div>

                    </form>
                )}

            </div>
        </div>
    );
};

export default CreateBlog;