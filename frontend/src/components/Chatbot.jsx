import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Globe, Leaf, Sprout, TrendingUp, CloudRain, Tractor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Smart response knowledge base (no API required)
const KNOWLEDGE_BASE = {
    greetings: {
        keywords: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening', 'hola'],
        responses: [
            "Hello! 🌾 I'm AgriBot, your farming assistant. How can I help you today?",
            "Namaste! 🙏 Welcome to AGRISMART. Ask me about crops, diseases, weather, or equipment!",
            "Hi there! 👋 I'm here to help with all your agricultural needs. What would you like to know?"
        ]
    },
    disease: {
        keywords: ['disease', 'sick', 'infection', 'pest', 'fungus', 'blight', 'spot', 'yellow leaves', 'wilting', 'diagnose'],
        responses: [
            "For plant disease detection, go to our **Disease Detection** page. Upload a photo of the affected leaf, and our AI model (88.2% accuracy) will identify the disease and suggest treatments within seconds!",
            "Common diseases we detect: \n• Late Blight (Tomato/Potato) \n• Early Blight \n• Leaf Mold \n• Bacterial Spot \n• Septoria Leaf Spot\n\nVisit Disease Detection to check your crops now!",
            "Tip: Take a clear photo of the affected leaf against a plain background for best results. Our AI covers 15 diseases across Tomato, Potato, and Pepper crops."
        ]
    },
    crops: {
        keywords: ['crop', 'plant', 'grow', 'season', 'recommend', 'which crop', 'what to plant', 'sowing', 'cultivate'],
        responses: [
            "🌱 For crop recommendations based on your season and soil: \n• 🌞 Summer: Cucumber, Watermelon, Muskmelon \n• 🌧 Monsoon: Rice, Corn, Cotton \n• ❄️ Winter: Wheat, Potato, Mustard \n• 🌸 Spring: Vegetables, Fruits\n\nVisit **Crop Recommendations** for personalized suggestions!",
            "Best crops by soil type: \n• Loamy: Most vegetables, Wheat \n• Clay: Rice, Cabbage \n• Sandy: Carrots, Potatoes \n• Black: Cotton, Wheat \n\nUse our Crop Recommendation tool with your exact soil type!"
        ]
    },
    yield: {
        keywords: ['yield', 'harvest', 'production', 'estimate', 'output', 'how much', 'prediction'],
        responses: [
            "📊 Use our **Yield Prediction** tool to estimate your harvest. Enter your crop type, area (hectares), rainfall (mm), temperature (°C), and soil type. You'll get an accurate estimate with confidence score!",
            "Factors affecting yield: \n1) Weather (rainfall & temperature) \n2) Soil quality \n3) Fertilizer use \n4) Irrigation\n\nOur prediction model considers all these for accurate estimates."
        ]
    },
    equipment: {
        keywords: ['tractor', 'equipment', 'rent', 'hire', 'machine', 'tool', 'harvester', 'drone', 'booking'],
        responses: [
            "🚜 Rent farming equipment from verified dealers near you! Available: Tractors, Harvesters, Drones, Sprayers, Seed Drills. Prices range ₹1,500-5,000/day. Go to **Equipment Service** to browse and book.",
            "To book equipment: \n1) Browse listings near you \n2) Select equipment \n3) Enter farm address & date \n4) Wait for dealer approval\n\nVisit Equipment Service now!"
        ]
    },
    weather: {
        keywords: ['weather', 'rain', 'temperature', 'climate', 'forecast', 'monsoon', 'humidity'],
        responses: [
            "🌤 Check your **Dashboard** for real-time weather based on your GPS location. We show temperature, humidity, wind speed, and 5-day forecast. Smart alerts notify you about conditions affecting your crops.",
            "Weather tips: \n🌧 Rain expected → Skip irrigation \n🌡 High temp → Increase watering \n💨 Strong winds → Avoid spraying \n🥶 Frost risk → Protect crops"
        ]
    },
    store: {
        keywords: ['store', 'buy', 'sell', 'market', 'price', 'produce', 'vegetable', 'fruit'],
        responses: [
            "🛒 Find fresh farm produce near you using **Store Locator**. See stores on map, check products & prices, and get directions. Farmers can list their produce via Manage Store.",
            "To buy directly from farms: Go to Store Locator → View stores → Click a store → See products with prices → Get directions!"
        ]
    },
    soil: {
        keywords: ['soil', 'fertilizer', 'nutrients', 'ph', 'manure', 'compost', 'organic'],
        responses: [
            "🌍 Soil health tips: \n1) Test pH regularly \n2) Use organic compost \n3) Practice crop rotation \n4) Add legumes for nitrogen \n5) Maintain proper drainage\n\nDifferent crops prefer different soils. Check Crop Recommendations!",
            "Organic fertilizers: \n• Compost (kitchen waste) \n• Vermicompost (worm castings) \n• Cow dung manure \n• Green manure (legumes) \n• Bone meal (phosphorus)"
        ]
    },
    help: {
        keywords: ['help', 'features', 'what can you do', 'services', 'menu', 'options'],
        responses: [
            "🤖 I can help you with: \n• 🔬 Disease Detection \n• 🌱 Crop Recommendations \n• 📊 Yield Prediction \n• 🚜 Equipment Rental \n• 🌤 Weather Updates \n• 🗺 Store Locator \n• 🌍 Soil Health\n\nJust ask me anything about these topics!",
            "AGRISMART features: AI disease detection (88% accuracy), seasonal crop recommendations, yield estimation, equipment booking from verified dealers, store locator, and real-time weather dashboard."
        ]
    },
    thanks: {
        keywords: ['thanks', 'thank you', 'thank', 'appreciate', 'helpful'],
        responses: [
            "You're welcome! 😊 Happy farming! If you need anything else, I'm here 24/7.",
            "Glad I could help! 🌾 Don't hesitate to ask if you have more questions.",
            "My pleasure! 🙏 May your crops grow healthy and your harvest be plenty!"
        ]
    }
};

// Multi-language support (basic)
const TRANSLATIONS = {
    English: {
        placeholder: 'Type your message...',
        online: 'Online',
        powered: 'Powered by AGRISMART AI',
    },
    Hindi: {
        placeholder: 'अपना संदेश लिखें...',
        online: 'ऑनलाइन',
        powered: 'AGRISMART AI द्वारा संचालित',
    },
    Punjabi: {
        placeholder: 'ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ...',
        online: 'ਆਨਲਾਈਨ',
        powered: 'AGRISMART AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ',
    }
};

const Chatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            type: 'bot', 
            text: "Hello! 👋 I'm AgriBot, your farming assistant.\n\nAsk me about:\n• 🔬 Disease Detection\n• 🌱 Crop Recommendations\n• 📊 Yield Prediction\n• 🚜 Equipment Rental\n• 🌤 Weather Updates\n• 🗺 Store Locator"
        }
    ]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('English');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const t = TRANSLATIONS[language] || TRANSLATIONS.English;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Find matching response from knowledge base
    const findResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        
        // Check each category
        for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
            if (data.keywords.some(keyword => lowerQuery.includes(keyword))) {
                return data.responses[Math.floor(Math.random() * data.responses.length)];
            }
        }
        
        // Fallback responses
        const fallbacks = [
            "I'm not sure about that. Try asking about: disease detection, crop recommendations, yield prediction, equipment rental, or weather updates!",
            "I can help with farming questions! Ask me about crops, diseases, weather, equipment, or finding local produce.",
            "For that specific query, I recommend checking our Disease Detection, Crop Recommendations, or Yield Prediction tools. They're AI-powered for accurate results!"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        
        // Add user message
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        // Simulate bot thinking + response
        setTimeout(() => {
            const botResponse = findResponse(userMessage);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
        }, 800 + Math.random() * 1200);
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 rounded-full bg-agri-green text-white shadow-2xl hover:bg-agri-dark hover:scale-105 transition-all z-40 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
                aria-label="Open Chatbot"
            >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
                    isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'
                }`}
                style={{ height: '600px', maxHeight: 'calc(100vh - 6rem)' }}
            >
                {/* Chat Header */}
                <div className="bg-agri-green p-4 rounded-t-2xl flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">AgriBot</h3>
                            <p className="text-xs text-green-100 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-300 block"></span> {t.online}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">

                        {/* Language Selector */}
                        <div className="relative group mr-2">
                            <button className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors">
                                <Globe className="w-3 h-3" /> {language}
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg border border-gray-100 w-32 hidden group-hover:block text-gray-800 z-50">
                                {['English', 'Hindi', 'Punjabi'].map(lang => (
                                    <button 
                                        key={lang}
                                        onClick={() => setLanguage(lang)} 
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${lang === 'English' ? 'rounded-t-lg' : ''} ${lang === 'Punjabi' ? 'rounded-b-lg' : ''}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Quick Suggestions */}
                {messages.length <= 1 && (
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { icon: Leaf, text: 'Disease detection', query: 'How to detect plant disease?' },
                                { icon: Sprout, text: 'Crop tips', query: 'Which crop to plant this season?' },
                                { icon: TrendingUp, text: 'Yield', query: 'Estimate my crop yield' },
                                { icon: Tractor, text: 'Equipment', query: 'How to rent a tractor?' },
                            ].map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: s.query }]);
                                        setIsTyping(true);
                                        setTimeout(() => {
                                            setIsTyping(false);
                                            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: findResponse(s.query) }]);
                                        }, 800 + Math.random() * 1000);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-agri-green hover:text-agri-green transition-colors"
                                >
                                    <s.icon className="w-3 h-3" /> {s.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                                    msg.type === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-agri-green'
                                }`}>
                                    {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`p-3 rounded-2xl ${
                                    msg.type === 'user'
                                        ? 'bg-agri-green text-white rounded-tr-sm shadow-md'
                                        : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                                }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-green-100 text-agri-green">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
                    <form onSubmit={handleSend} className="flex gap-2 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t.placeholder}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className={`p-3 rounded-full flex items-center justify-center transition-all ${
                                input.trim()
                                    ? 'bg-agri-green text-white hover:bg-agri-dark shadow-md hover:-translate-y-0.5'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                    <div className="mt-2 text-center">
                        <p className="text-[10px] text-gray-400">{t.powered}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;