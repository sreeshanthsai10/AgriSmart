import { Mail, Phone, MapPin, Send, MessageSquare, Loader, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const [status, setStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus(null), 5000);
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header - Matching your style */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <MessageSquare className="w-8 h-8 text-agri-green" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Get in <span className="text-agri-green">Touch</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Whether you are looking to scale your farming operations with our enterprise tools, or just have a few questions, our team is ready to help you succeed.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-agri-green rounded-full"></span>
                                Contact Information
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-50 rounded-xl flex-shrink-0">
                                        <Mail className="w-5 h-5 text-agri-green" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 mb-1">Email Us</p>
                                        <p className="text-gray-600 text-sm hover:text-agri-green transition-colors cursor-pointer">sales@agrismart.com</p>
                                        <p className="text-gray-600 text-sm hover:text-agri-green transition-colors cursor-pointer">support@agrismart.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-50 rounded-xl flex-shrink-0">
                                        <Phone className="w-5 h-5 text-agri-green" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 mb-1">Call Us</p>
                                        <p className="text-gray-600 text-sm hover:text-agri-green transition-colors cursor-pointer">+1 (555) 123-4567</p>
                                        <p className="text-gray-400 text-xs mt-1">Mon-Fri from 8am to 5pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-50 rounded-xl flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-agri-green" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 mb-1">Visit Us</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            123 AgriTech Valley<br />
                                            San Francisco, CA 94105<br />
                                            United States
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Help Box */}
                        <div className="bg-gradient-to-br from-agri-green to-emerald-700 rounded-2xl p-8 text-white shadow-lg">
                            <MessageSquare className="w-8 h-8 mb-4 text-green-100" />
                            <h3 className="text-xl font-bold mb-2">Need quick help?</h3>
                            <p className="text-green-50 text-sm mb-6 leading-relaxed">
                                Our AI chatbot is available 24/7 to answer general questions about the platform, pricing, and features immediately.
                            </p>
                            <button className="w-full bg-white text-agri-green font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors shadow-sm">
                                Open Chat Now
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <span className="w-1 h-6 bg-agri-green rounded-full"></span>
                                Send us a message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-all bg-gray-50 focus:bg-white"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-all bg-gray-50 focus:bg-white"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-all bg-gray-50 focus:bg-white"
                                            placeholder="john@farm.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-all bg-gray-50 focus:bg-white"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1.5">How can we help?</label>
                                    <select
                                        id="topic"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-all bg-gray-50 focus:bg-white text-gray-700"
                                    >
                                        <option value="sales">I want to discuss enterprise pricing</option>
                                        <option value="demo">I'd like a personalized demo</option>
                                        <option value="support">I need technical support</option>
                                        <option value="partnership">I'm interested in partnering</option>
                                        <option value="other">Other inquiry</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                    <textarea
                                        id="message"
                                        rows="5"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                        placeholder="Tell us a little bit about your farm or organization..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className={`w-full flex justify-center items-center py-4 px-6 rounded-xl text-white font-semibold text-base transition-all shadow-md ${
                                        status === 'sending' 
                                            ? 'bg-green-400 cursor-not-allowed' 
                                            : status === 'success' 
                                                ? 'bg-emerald-500' 
                                                : 'bg-agri-green hover:bg-agri-dark hover:shadow-lg'
                                    }`}
                                >
                                    {status === 'sending' ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="animate-spin w-5 h-5" /> Sending Message...
                                        </span>
                                    ) : status === 'success' ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" /> Message Sent Successfully!
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Send Message
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;