import { useState } from 'react';
import { Cloud, Leaf, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DiseasePrediction = () => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const fileObj = e.target.files[0];
            setFile(fileObj);
            setSelectedImage(URL.createObjectURL(fileObj));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('http://localhost:8001/api/v1/predict', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            setResult({
                disease: data.disease_info?.disease || data.top_prediction?.class_name || 'Unknown',
                confidence: data.top_prediction?.confidence || 0,
                severity: data.disease_info?.severity || 'Unknown',
                recommendations: [
                    data.disease_info?.treatment || 'No treatment info available',
                    data.disease_info?.prevention || 'No prevention info available'
                ]
            });

        } catch (error) {
            console.error(error);
            alert("Prediction failed");
        }

        setIsAnalyzing(false);
    };

    const handleReset = () => {
        setSelectedImage(null);
        setResult(null);
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <Leaf className="w-8 h-8 text-agri-green" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('disease.title')}</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('disease.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Cloud className="w-5 h-5 text-agri-green" /> {t('disease.uploadImage')}
                        </h2>

                        {!selectedImage ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Cloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-agri-green transition-colors mb-4" />
                                <p className="text-sm font-medium text-gray-900">{t('disease.clickOrDrag')}</p>
                                <p className="text-xs text-gray-500 mt-2">{t('disease.fileTypes')}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="relative rounded-xl overflow-hidden shadow-inner bg-gray-100 aspect-video flex items-center justify-center">
                                    <img src={selectedImage} alt="Selected leaf" className="max-h-full object-contain" />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        {t('disease.tryAnother')}
                                    </button>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing || result}
                                        className={`flex-1 flex justify-center items-center px-4 py-3 rounded-xl text-white font-medium transition-all ${isAnalyzing || result ? 'bg-green-400 cursor-not-allowed' : 'bg-agri-green hover:bg-agri-dark shadow-md'
                                            }`}
                                    >
                                        {isAnalyzing ? (
                                            <><Loader className="animate-spin -ml-1 mr-2 h-5 w-5" /> {t('disease.analyzing')}</>
                                        ) : (
                                            t('disease.analyzeImage')
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all duration-500 ${!result && !isAnalyzing ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('disease.resultsTitle')}</h2>

                        {!result && !isAnalyzing && (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                <CheckCircle className="w-12 h-12 mb-4 opacity-50" />
                                <p>{t('disease.resultsPlaceholder')}</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="h-64 flex flex-col items-center justify-center text-agri-green">
                                <div className="w-16 h-16 border-4 border-green-100 border-t-agri-green rounded-full animate-spin mb-4"></div>
                                <p className="font-medium animate-pulse">{t('disease.analyzing2')}</p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-start justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div>
                                        <p className="text-sm font-medium text-red-800 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {t('disease.detectedDisease')}</p>
                                        <h3 className="text-2xl font-bold text-red-900 mt-1">{result.disease}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-500">{t('disease.confidence')}</p>
                                        <p className="text-xl font-bold text-gray-900">{result.confidence}%</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-agri-green" /> {t('disease.recommendedTreatment')}
                                    </h4>
                                    <ul className="space-y-3">
                                        {result.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-agri-green flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-gray-700">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                        <p className="text-amber-700 text-xs leading-relaxed">{t('disease.disclaimer')}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiseasePrediction;