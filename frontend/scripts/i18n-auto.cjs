const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join('c:', 'Users', 'srees', '.gemini', 'antigravity', 'scratch', 'agrismart', 'frontend');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');

const filesToRefactor = [
    {
        file: path.join(SRC_DIR, 'pages', 'YieldPrediction.jsx'),
        replacements: [
            { from: 'Yield Prediction', key: 'yieldPrediction.title', en: 'Yield Prediction', hi: 'उपज की भविष्यवाणी', te: 'దిగుబడి అంచనా' },
            { from: 'Estimate your harvest volume based on historical data, weather patterns, and soil conditions.', key: 'yieldPrediction.subtitle', en: 'Estimate your harvest volume based on historical data, weather patterns, and soil conditions.', hi: 'ऐतिहासिक डेटा, मौसम के पैटर्न और मिट्टी की स्थिति के आधार पर अपनी फसल की मात्रा का अनुमान लगाएं।', te: 'చారిత్రక డేటా, వాతావరణ నమూనాలు మరియు నేల పరిస్థితుల ఆధారంగా మీ పంట పరిమాణాన్ని అంచనా వేయండి.' },
            { from: 'Field Parameters', key: 'yieldPrediction.fieldParams', en: 'Field Parameters', hi: 'क्षेत्र मापदंड', te: 'ఫీల్డ్ పారామితులు' },
            { from: 'Crop Type', key: 'yieldPrediction.cropType', en: 'Crop Type', hi: 'फसल का प्रकार', te: 'పంట రకం' },
            { from: 'Total Area (hectares)', key: 'yieldPrediction.totalArea', en: 'Total Area (hectares)', hi: 'कुल क्षेत्रफल (हेक्टेयर)', te: 'మొత్తం విസ്തీర్ణం (హెక్టార్లు)' },
            { from: 'Average Rainfall (mm)', key: 'yieldPrediction.avgRainfall', en: 'Average Rainfall (mm)', hi: 'औसत वर्षा (मिमी)', te: 'సగటు వర్షపాతం (మిమీ)' },
            { from: 'Avg Temperature (°C)', key: 'yieldPrediction.avgTemp', en: 'Avg Temperature (°C)', hi: 'औसत तापमान (°C)', te: 'సగటు ఉష్ణోగ్రత (°C)' },
            { from: 'Soil Type', key: 'yieldPrediction.soilType', en: 'Soil Type', hi: 'मिट्टी के प्रकार', te: 'నేల రకం' },
            { from: 'Predict Yield', key: 'yieldPrediction.predictBtn', en: 'Predict Yield', hi: 'उपज की भविष्यवाणी करें', te: 'దిగుబడిని అంచనా వేయండి' },
            { from: 'Ready to Analyze', key: 'yieldPrediction.readyToAnalyze', en: 'Ready to Analyze', hi: 'विश्लेषण के लिए तैयार', te: 'విశ్లేషణకు సిద్ధంగా ఉంది' },
            { from: 'Enter your field parameters on the left and click predict to see estimated harvest yields.', key: 'yieldPrediction.enterParams', en: 'Enter your field parameters on the left and click predict to see estimated harvest yields.', hi: 'बाईं ओर अपने क्षेत्र के पैरामीटर दर्ज करें और अनुमानित फसल की पैदावार देखने के लिए भविष्यवाणी पर क्लिक करें।', te: 'ఎడమ వైపున మీ ఫీల్డ్ పారామితులను నమోదు చేయండి మరియు అంచనా వేసిన పంట దిగుబడిని చూడటానికి అంచనా వేయండి క్లిక్ చేయండి.' },
        ]
    },
    {
        file: path.join(SRC_DIR, 'pages', 'Blog.jsx'),
        replacements: [
            { from: 'AgriSmart Knowledge Hub', key: 'blog.title', en: 'AgriSmart Knowledge Hub', hi: 'एग्रीस्मार्ट नॉलेज हब', te: 'అగ్రిస్మార్ట్ నాలెడ్జ్ హబ్' },
            { from: 'Expert advice, modern techniques, and agricultural news to help you grow better.', key: 'blog.subtitle', en: 'Expert advice, modern techniques, and agricultural news to help you grow better.', hi: 'विशेषज्ञ सलाह, आधुनिक तकनीकें और कृषि समाचार आपको बेहतर विकास में मदद करने के लिए।', te: 'మీరు మెరుగ్గా ఎదగడానికి నిపుణుల సలహాలు, ఆధునిక పద్ధతులు మరియు వ్యవసాయ వార్తలు.' },
            { from: 'Featured Guide', key: 'blog.featuredGuide', en: 'Featured Guide', hi: 'फीचर्ड गाइड', te: 'ఫీచర్డ్ గైడ్' },
            { from: 'Read Article', key: 'blog.readArticle', en: 'Read Article', hi: 'लेख पढ़ें', te: 'వ్యాసం చదవండి' },
            { from: 'Load More Articles', key: 'blog.loadMore', en: 'Load More Articles', hi: 'और लेख लोड करें', te: 'మరిన్ని వ్యాసాలను లోడ్ చేయండి' },
        ]
    }
];

const locales = {
    en: {},
    hi: {},
    te: {}
};

function processFile(fileObj) {
    if (!fs.existsSync(fileObj.file)) {
        console.log(`File not found: ${fileObj.file}`);
        return;
    }
    let content = fs.readFileSync(fileObj.file, 'utf8');

    // Add import if missing
    if (!content.includes('useTranslation')) {
        content = content.replace(/import .*?from 'lucide-react';/, match => `import { useTranslation } from 'react-i18next';\n${match}`);
    }

    // Add hook if missing
    const componentRegex = /const (\w+) = \(\) => {/;
    if (!content.includes('const { t } = useTranslation();')) {
        content = content.replace(componentRegex, match => `${match}\n    const { t } = useTranslation();`);
    }

    fileObj.replacements.forEach(rep => {
        // Build locales
        const keys = rep.key.split('.');
        const domain = keys[0];
        const key = keys[1];

        ['en', 'hi', 'te'].forEach(lang => {
            if (!locales[lang][domain]) locales[lang][domain] = {};
            locales[lang][domain][key] = rep[lang];
        });

        // Replace in content (simple global replace, careful with regex characters)
        const escapedFrom = rep.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`>\\s*${escapedFrom}\\s*<`, 'g');
        content = content.replace(regex, `>{t('${rep.key}')}<`);
        
        // Sometimes it's not between tags
        const standaloneRegex = new RegExp(`(['"\`])${escapedFrom}\\1`, 'g');
        content = content.replace(standaloneRegex, `t('${rep.key}')`);
    });

    fs.writeFileSync(fileObj.file, content);
    console.log(`Updated ${fileObj.file}`);
}

filesToRefactor.forEach(processFile);

// Update translation JSONs
['en', 'hi', 'te'].forEach(lang => {
    const filePath = path.join(SRC_DIR, 'locales', lang, 'translation.json');
    if (fs.existsSync(filePath)) {
        const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Deep merge
        Object.keys(locales[lang]).forEach(domain => {
            if (!currentData[domain]) currentData[domain] = {};
            Object.keys(locales[lang][domain]).forEach(key => {
                currentData[domain][key] = locales[lang][domain][key];
            });
        });

        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 4));
        console.log(`Updated translation.json for ${lang}`);
    }
});
