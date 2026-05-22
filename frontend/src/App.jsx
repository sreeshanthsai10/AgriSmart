import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DiseasePrediction from './pages/DiseasePrediction';
import YieldPrediction from './pages/YieldPrediction';
import CropRecommendations from './pages/CropRecommendations';
import MarketPrices from './pages/MarketPrices';
import Blog from './pages/Blog';
import StoreLocator from './pages/StoreLocator';
import ManageStore from './pages/ManageStore';
import CreateBlog from './pages/CreateBlog';
import Features from './pages/Features';
import Contact from './pages/Contact';
import GetService from './pages/GetService';
import DealerEquipment from './pages/DealerEquipment';
import ServiceRequests from './pages/ServiceRequests';
import ProtectedRoute from './components/ProtectedRoute';
import BlogDetails from './pages/BlogDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen font-sans">
          <Navbar />
          <div className="flex flex-grow w-full max-w-[100vw]">
            <Sidebar />
            <div className="flex flex-col flex-grow min-w-0 bg-gray-50">
              <main className="flex-grow flex flex-col">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/disease-prediction" element={<DiseasePrediction />} />
                  <Route path="/yield-prediction" element={<YieldPrediction />} />
                  <Route path="/recommendations" element={<CropRecommendations />} />
                  <Route path="/market-prices" element={<MarketPrices />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogDetails />} />
                  <Route path="/store-locator" element={<StoreLocator />} />
                  <Route path="/manage-store" element={<ManageStore />} />
                  <Route path="/create-blog" element={<CreateBlog />} />
                  <Route path="/get-service" element={<GetService />} />
                  <Route path="/dealer-equipment" element={<DealerEquipment />} />
                  <Route path="/service-requests" element={<ServiceRequests />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
          <Chatbot />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
