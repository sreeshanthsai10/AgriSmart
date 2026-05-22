const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join('c:', 'Users', 'srees', '.gemini', 'antigravity', 'scratch', 'agrismart', 'frontend');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');

const filesToRefactor = [
    {
        file: path.join(SRC_DIR, 'pages', 'DealerEquipment.jsx'),
        replacements: [
            { from: 'My Equipment Listings', key: 'dealer.title', en: 'My Equipment Listings', hi: 'मेरे उपकरण सूची', te: 'నా పరికరాల జాబితాలు' },
            { from: 'Upload and manage agricultural tools available for farmer hire', key: 'dealer.subtitle', en: 'Upload and manage agricultural tools available for farmer hire', hi: 'किसानों को किराए पर उपलब्ध कृषि उपकरणों को अपलोड और प्रबंधित करें', te: 'రైతులకు అద్దెకు అందుబాటులో ఉన్న వ్యవసాయ పరికరాలను అప్‌లోడ్ చేయండి మరియు నిర్వహించండి' },
            { from: 'Add Equipment', key: 'dealer.addEqBtn', en: 'Add Equipment', hi: 'उपकरण जोड़ें', te: 'పరికరాన్ని జోడించండి' },
            { from: 'Total Listings', key: 'dealer.totalListings', en: 'Total Listings', hi: 'कुल सूची', te: 'మొత్తం జాబితాలు' },
            { from: 'Available', key: 'dealer.available', en: 'Available', hi: 'उपलब्ध', te: 'అందుబాటులో ఉంది' },
            { from: 'Unavailable', key: 'dealer.unavailable', en: 'Unavailable', hi: 'अनुपलब्ध', te: 'అందుబాటులో లేదు' },
            { from: 'No equipment yet', key: 'dealer.noEq', en: 'No equipment yet', hi: 'अभी तक कोई उपकरण नहीं', te: 'ఇంకా ఎలాంటి ప‌రిక‌రాలు లేవు' },
        ]
    },
    {
        file: path.join(SRC_DIR, 'pages', 'GetService.jsx'),
        replacements: [
            { from: 'Agricultural Equipment Rental', key: 'getService.title', en: 'Agricultural Equipment Rental', hi: 'कृषि उपकरण किराया', te: 'వ్యవసాయ పరికరాల అద్దె' },
            { from: 'Browse and rent modern agricultural tools from trusted local dealers', key: 'getService.subtitle', en: 'Browse and rent modern agricultural tools from trusted local dealers', hi: 'विश्वसनीय स्थानीय डीलरों से आधुनिक कृषि उपकरण ब्राउज़ करें और किराए पर लें', te: 'నమ్మదగిన స్థానిక డీలర్ల నుండి ఆధునిక వ్యవసాయ పరికరాలను బ్రౌజ్ చేయండి మరియు అద్దెకు తీసుకోండి' },
            { from: 'Request Service', key: 'getService.requestBtn', en: 'Request Service', hi: 'सेवा का अनुरोध करें', te: 'సేవ కోసం అభ్యర్థించండి' },
            { from: 'Confirm Request', key: 'getService.confirmBtn', en: 'Confirm Request', hi: 'अनुरोध की पुष्टि करें', te: 'అభ్యర్థనను నిర్ధారించండి' }
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
        content = content.replace(/import .*?from '(lucide-react|react)';/, match => `import { useTranslation } from 'react-i18next';\n${match}`);
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
