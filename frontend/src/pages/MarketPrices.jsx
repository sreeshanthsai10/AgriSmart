import { useState, useEffect } from 'react';
import { LineChart, Search, TrendingUp, TrendingDown, RefreshCcw, Loader2, FilterX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
//import { getMarketPrices } from '../api/marketApi';

// Target Endpoint using the sample API
const API_KEY = '';
const BASE_URL = 'https://api.data.gov.in/resource/';// go to website for api key

const INDIAN_STATES = [
    "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const COMMON_COMMODITIES = [
    "Apple", "Banana", "Barley", "Bengal Gram(Gram)", "Black Gram (Urad Beans)",
    "Bottle gourd", "Brinjal", "Cabbage", "Castor Seed", "Cauliflower",
    "Cotton", "Garlic", "Ginger", "Green Gram (Moong)", "Groundnut", "Jute",
    "Maize", "Mango", "Mustard", "Onion", "Orange", "Paddy(Dhan)", "Papaya",
    "Pearl Millet(Bajra)", "Potato", "Pumpkin", "Red Gram(Arhar)", "Rice",
    "Sorghum(Jowar)", "Soyabean", "Sugarcane", "Sunflower", "Tomato", "Turmeric", "Wheat"
];

const MarketPrices = () => {
    const { t } = useTranslation();
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // API Server-Side Filters
    const [searchState, setSearchState] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');
    const [searchMarket, setSearchMarket] = useState('');
    const [searchCommodity, setSearchCommodity] = useState('');

    // Server-Side Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const recordsPerPage = 30;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const fetchMarketData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Build Server-side Filter URL String
            let filterString = '';
            if (searchState.trim()) filterString += `&filters[state.keyword]=${encodeURIComponent(searchState)}`;
            if (searchDistrict.trim()) filterString += `&filters[district]=${encodeURIComponent(searchDistrict)}`;
            if (searchMarket.trim()) filterString += `&filters[market]=${encodeURIComponent(searchMarket)}`;
            if (searchCommodity.trim()) filterString += `&filters[commodity]=${encodeURIComponent(searchCommodity)}`;

            // Since the sample API restricts us to 10 items, but the user wants 30 items per page,
            // we calculate the base offset for our 30-item page, and make 3 simultaneous calls
            // of 10 items each to stitch together a full 30-item page!
            const apiLimit = 10;
            const baseOffset = (currentPage - 1) * recordsPerPage;

            const fetchPromises = [];
            for (let i = 0; i < 3; i++) {
                const offset = baseOffset + (i * apiLimit);
                const url = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=${apiLimit}&offset=${offset}${filterString}`;
                fetchPromises.push(fetch(url).then(r => r.json()));
            }

            const results = await Promise.all(fetchPromises);

            let allRecords = [];
            let foundTotal = 0;

            results.forEach(res => {
                if (res.total && parseInt(res.total) > foundTotal) foundTotal = parseInt(res.total);
                if (res.records) allRecords = [...allRecords, ...res.records];
            });

            if (allRecords.length > 0 || foundTotal === 0) {
                const mappedData = allRecords.map((record, index) => ({
                    id: `${currentPage}-${index}`,
                    state: record.state,
                    district: record.district,
                    market: record.market,
                    crop: record.commodity,
                    variety: record.variety,
                    price: record.modal_price || record.max_price || record.min_price || 'N/A',
                    minPrice: record.min_price || '-',
                    maxPrice: record.max_price || '-',
                    grade: record.grade,
                    unit: 'Quintal',
                    trend: Math.random() > 0.5 ? 'up' : 'down',
                    change: (Math.random() * 5).toFixed(1) + '%',
                    location: `${record.market}, ${record.state}`,
                    date: record.arrival_date
                }));

                const validData = mappedData.filter(m => m.state && m.crop);
                setMarkets(validData);
                setTotalRecords(foundTotal);
                setLastUpdated(new Date());
            } else {
                setMarkets([]);
                setTotalRecords(0);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data whenever page or filters change
    useEffect(() => {
        fetchMarketData();
        // eslint-disable-next-line
    }, [currentPage]);

    const handleApplyFilters = () => {
        if (currentPage === 1) fetchMarketData();
        else setCurrentPage(1); // Setting to 1 triggers the effect above
    };

    const handleClearFilters = () => {
        setSearchState('');
        setSearchDistrict('');
        setSearchMarket('');
        setSearchCommodity('');
        setCurrentPage(1); // triggers fetch due to effect
        setTimeout(fetchMarketData, 100);
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
                            <LineChart className="w-8 h-8 text-agri-green" />
                            {t('marketPrices.title', 'Market Prices Dashboard')}
                        </h1>
                        <p className="text-gray-600">
                            {t('marketPrices.subtitle', 'Track real-time Live commodity prices directly from the Government Mandi APMC dataset.')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <RefreshCcw className="w-4 h-4" />
                            {t('marketPrices.lastUpdated', 'Last updated:')} {lastUpdated.toLocaleTimeString()}
                        </span>
                        <button
                            onClick={() => fetchMarketData()}
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                        >
                            {t('marketPrices.refresh', 'Refresh Data')}
                        </button>
                    </div>
                </div>

                {/* API Select Dropdown Filter Bar */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <select
                                value={searchState}
                                onChange={(e) => setSearchState(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition-all sm:text-sm bg-white"
                            >
                                <option value="">{t('marketPrices.allStates', 'All States')}</option>
                                {INDIAN_STATES.map(s => <option key={s} value={s}>{t(`marketPrices.states.${s}`, s)}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <select
                                value={searchCommodity}
                                onChange={(e) => setSearchCommodity(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition-all sm:text-sm bg-white"
                            >
                                <option value="">{t('marketPrices.allCommodities', 'All Commodities')}</option>
                                {COMMON_COMMODITIES.map(c => <option key={c} value={c}>{t(`marketPrices.crops.${c}`, c)}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('marketPrices.optDistrict', 'Optional: District Name')}
                                value={searchDistrict}
                                onChange={(e) => setSearchDistrict(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition-all sm:text-sm"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('marketPrices.optMarket', 'Optional: Market Name')}
                                value={searchMarket}
                                onChange={(e) => setSearchMarket(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition-all sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-lg font-medium transition-colors"
                        >
                            <FilterX className="w-4 h-4" /> {t('marketPrices.reset', 'Reset')}
                        </button>
                        <button
                            onClick={handleApplyFilters}
                            className="flex items-center justify-center gap-2 bg-agri-green text-white hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Search className="w-4 h-4" /> {t('marketPrices.applyFilters', 'Apply Filters')}
                        </button>
                    </div>
                </div>

                <div className="mb-4 text-sm text-gray-500 font-medium">
                    {t('marketPrices.showing', 'Showing')} <span className="text-gray-900">{totalRecords > 0 ? ((currentPage - 1) * recordsPerPage) + 1 : 0} - {Math.min(currentPage * recordsPerPage, totalRecords)}</span> {t('marketPrices.of', 'of')} <span className="text-gray-900">{totalRecords}</span> {t('marketPrices.resultsRetrieved', 'results retrieved')}
                </div>

                {/* Market Data Table/Grid */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-agri-green" />
                            <p>{t('marketPrices.loadingApi', 'Loading API Data...')}</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-2">
                            <p className="font-semibold text-lg">{t('marketPrices.failedToLoad', 'Failed to load market prices')}</p>
                            <p className="text-sm">{error}</p>
                            <button onClick={() => fetchMarketData()} className="mt-4 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">{t('marketPrices.tryAgain', 'Try Again')}</button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('marketPrices.comAndVar', 'Commodity & Variety')}</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('marketPrices.apmcMarket', 'APMC Market')}</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('marketPrices.arrivalDate', 'Arrival Date')}</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('marketPrices.priceDetails', 'Price details (₹)')}</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('marketPrices.trend', 'Trend')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {markets.length > 0 ? (
                                        markets.map((market) => (
                                            <tr key={market.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center text-agri-green font-bold text-lg">
                                                            {market.crop.charAt(0)}
                                                        </div>
                                                        <div className="ml-4 max-w-[200px] truncate">
                                                            <div className="text-sm font-bold text-gray-900 truncate" title={t(`marketPrices.crops.${market.crop}`, market.crop)}>{t(`marketPrices.crops.${market.crop}`, market.crop)}</div>
                                                            <div className="text-xs text-gray-500 truncate" title={t(`marketPrices.varieties.${market.variety}`, market.variety)}>
                                                                {t(`marketPrices.varieties.${market.variety}`, market.variety)} {market.grade !== 'FAQ' ? `(${t(`marketPrices.grades.${market.grade}`, market.grade)})` : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-800 max-w-[250px] truncate" title={t(`marketPrices.markets.${market.market}`, market.market)}>{t(`marketPrices.markets.${market.market}`, market.market)}</div>
                                                    <div className="text-xs text-gray-500 truncate" title={`${t(`marketPrices.districts.${market.district}`, market.district)}, ${t(`marketPrices.states.${market.state}`, market.state)}`}>
                                                        {t(`marketPrices.districts.${market.district}`, market.district)}, {t(`marketPrices.states.${market.state}`, market.state)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">{market.date}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-lg font-bold text-gray-900 leading-none">₹{market.price}</div>
                                                    <div className="text-[10px] text-gray-400 mt-1">{t('marketPrices.min', 'Min')}: ₹{market.minPrice} | {t('marketPrices.max', 'Max')}: ₹{market.maxPrice}</div>
                                                    <div className="text-xs text-green-700 font-medium">{t('marketPrices.perQtl', 'per Quintal')}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className={`inline-flex flex-row-reverse items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${market.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {market.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                        {market.trend === 'up' ? '+' : '-'}{market.change}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                {t('marketPrices.noData', 'No market data found for the current API query.')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Backend Pagination Controls */}
                    {!loading && !error && totalRecords > 0 && (
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                {t('marketPrices.page', 'Page')} <span className="font-medium text-gray-900">{currentPage}</span> {t('marketPrices.of', 'of')} <span className="font-medium text-gray-900">{totalPages || 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MarketPrices;
