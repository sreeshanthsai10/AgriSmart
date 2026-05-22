const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '../src/locales');

const uiTranslations = {
  en: {
    title: "Market Prices Dashboard",
    subtitle: "Track real-time Live commodity prices directly from the Government Mandi APMC dataset.",
    lastUpdated: "Last updated:",
    refresh: "Refresh Data",
    allStates: "All States",
    allCommodities: "All Commodities",
    optDistrict: "Optional: District Name",
    optMarket: "Optional: Market Name",
    reset: "Reset",
    applyFilters: "Apply Filters",
    showing: "Showing",
    of: "of",
    resultsRetrieved: "results retrieved from API",
    comAndVar: "Commodity & Variety",
    apmcMarket: "APMC Market",
    arrivalDate: "Arrival Date",
    priceDetails: "Price details (₹)",
    trend: "Trend",
    min: "Min",
    max: "Max",
    perQtl: "per Quintal",
    noData: "No market data found for the current query.",
    page: "Page",
    loadingApi: "Loading Data...",
    failedToLoad: "Failed to load market prices",
    tryAgain: "Try Again",
    states: {
      "Uttar Pradesh": "Uttar Pradesh",
      "Maharashtra": "Maharashtra",
      "Madhya Pradesh": "Madhya Pradesh",
      "Tamil Nadu": "Tamil Nadu",
      "Rajasthan": "Rajasthan",
      "Gujarat": "Gujarat",
      "Andhra Pradesh": "Andhra Pradesh",
      "Telangana": "Telangana"
    },
    crops: {
      "Tomato": "Tomato",
      "Potato": "Potato",
      "Onion": "Onion",
      "Wheat": "Wheat",
      "Rice": "Rice",
      "Mango": "Mango",
      "Apple": "Apple",
      "Cotton": "Cotton"
    }
  },
  hi: {
    title: "बाजार मूल्य डैशबोर्ड",
    subtitle: "सरकारी मंडी APMC डेटासेट से सीधे वास्तविक समय की लाइव कमोडिटी कीमतों को ट्रैक करें।",
    lastUpdated: "अंतिम अपडेट:",
    refresh: "डेटा रीफ्रेश करें",
    allStates: "सभी राज्य",
    allCommodities: "सभी कमोडिटीज",
    optDistrict: "वैकल्पिक: जिले का नाम",
    optMarket: "वैकल्पिक: बाजार का नाम",
    reset: "रीसेट",
    applyFilters: "फ़िल्टर लागू करें",
    showing: "दिखा रहा है",
    of: "से",
    resultsRetrieved: "परिणाम से प्राप्त हुए",
    comAndVar: "कमोडिटी और किस्म",
    apmcMarket: "APMC मंडी",
    arrivalDate: "आगमन तिथि",
    priceDetails: "मूल्य विवरण (₹)",
    trend: "प्रवृत्ति (Trend)",
    min: "न्यूनतम",
    max: "अधिकतम",
    perQtl: "प्रति क्विंटल",
    noData: "मंडी की मौजूदा क्वेरी के लिए कोई डेटा नहीं मिला।",
    page: "पृष्ठ",
    loadingApi: "डेटा लोड हो रहा है...",
    failedToLoad: "बाजार मूल्य लोड करने में विफल",
    tryAgain: "पुनः प्रयास करें",
    states: {
      "Uttar Pradesh": "उत्तर प्रदेश",
      "Maharashtra": "महाराष्ट्र",
      "Madhya Pradesh": "मध्य प्रदेश",
      "Tamil Nadu": "तमिलनाडु",
      "Rajasthan": "राजस्थान",
      "Gujarat": "गुजरात",
      "Andhra Pradesh": "आंध्र प्रदेश",
      "Telangana": "तेलंगाना"
    },
    crops: {
      "Tomato": "टमाटर",
      "Potato": "आलू",
      "Onion": "प्याज",
      "Wheat": "गेहूँ",
      "Rice": "चावल",
      "Mango": "आम",
      "Apple": "सेब",
      "Cotton": "कपास"
    }
  },
  te: {
    title: "మార్కెట్ ధరల డ్యాష్‌బోర్డ్",
    subtitle: "ప్రభుత్వ మండి APMC డేటాసెట్ నుండి సరుకుల ధరలను నేరుగా ట్రాక్ చేయండి.",
    lastUpdated: "చివరిగా నవీకరించబడినది:",
    refresh: "డేటాను రిఫ్రెష్ చేయండి",
    allStates: "అన్ని రాష్ట్రాలు",
    allCommodities: "అన్ని వస్తువులు",
    optDistrict: "ఐచ్ఛికం: జిల్లా పేరు",
    optMarket: "ఐచ్ఛికం: మార్కెట్ పేరు",
    reset: "రీసెట్",
    applyFilters: "ఫిల్టర్‌లను వర్తింపజేయండి",
    showing: "చూపుతోంది",
    of: "నుండి",
    resultsRetrieved: "API నుండి వచ్చిన ఫలితాలు",
    comAndVar: "వస్తువు & రకం",
    apmcMarket: "APMC మార్కెట్",
    arrivalDate: "చేరిన తేదీ",
    priceDetails: "ధర விவரాలు (₹)",
    trend: "ధోరణి (Trend)",
    min: "కనిష్ట",
    max: "గరిష్ట",
    perQtl: "క్వింటాల్‌కి",
    noData: "ప్రస్తుత ప్రశ్న కోసం మార్కెట్ డేటా కనుగొనబడలేదు.",
    page: "పేజీ",
    loadingApi: "డేటా లోడ్ అవుతోంది...",
    failedToLoad: "మార్కెట్ ధరలను లోడ్ చేయడంలో విఫలమైంది",
    tryAgain: "మళ్లీ ప్రయత్నించండి",
    states: {
      "Uttar Pradesh": "ఉత్తర ప్రదేశ్",
      "Maharashtra": "మహారాష్ట్ర",
      "Madhya Pradesh": "మధ్యప్రదేశ్",
      "Tamil Nadu": "తమిళనాడు",
      "Rajasthan": "రాజస్థాన్",
      "Gujarat": "గుజరాత్",
      "Andhra Pradesh": "ఆంధ్ర ప్రదేశ్",
      "Telangana": "తెలంగాణ"
    },
    crops: {
      "Tomato": "టమాటా",
      "Potato": "బంగాళదుంప",
      "Onion": "ఉల్లిపాయ",
      "Wheat": "గోధుమ",
      "Rice": "బియ్యం",
      "Mango": "మామిడి",
      "Apple": "ఆపిల్",
      "Cotton": "పత్తి"
    }
  }
};

['en', 'hi', 'te'].forEach(lang => {
  const tFile = path.join(localesPath, lang, 'translation.json');
  if (fs.existsSync(tFile)) {
    const data = JSON.parse(fs.readFileSync(tFile, 'utf8'));
    data.marketPrices = uiTranslations[lang];
    fs.writeFileSync(tFile, JSON.stringify(data, null, 2));
  }
});
console.log('Translations injected to json files.');
