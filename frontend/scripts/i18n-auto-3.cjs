const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join('c:', 'Users', 'srees', '.gemini', 'antigravity', 'scratch', 'agrismart', 'frontend');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');

const filesToRefactor = [
    {
        file: path.join(SRC_DIR, 'pages', 'ServiceRequests.jsx'),
        replacements: [
            { from: 'Service Requests', key: 'serviceReq.title', en: 'Service Requests', hi: 'सेवा अनुरोध', te: 'సేవా అభ్యర్థనలు' },
            { from: 'Manage and track equipment rental requests from local farmers', key: 'serviceReq.subtitle', en: 'Manage and track equipment rental requests from local farmers', hi: 'स्थानीय किसानों से उपकरण किराए पर लेने के अनुरोधों को प्रबंधित और ट्रैक करें', te: 'స్థానిక రైతుల నుండి పరికరాల అద్దె అభ్యర్థనలను నిర్వహించండి మరియు ట్రాక్ చేయండి' },
            { from: 'Pending', key: 'serviceReq.pending', en: 'Pending', hi: 'लंबित', te: 'పెండింగ్‌లో ఉంది' },
            { from: 'Approved', key: 'serviceReq.approved', en: 'Approved', hi: 'साभार स्वीकृत', te: 'ఆమోదించబడింది' },
            { from: 'Rejected', key: 'serviceReq.rejected', en: 'Rejected', hi: 'अस्वीकृत', te: 'తిరస్కరించబడింది' },
            { from: 'Start Date:', key: 'serviceReq.startDate', en: 'Start Date:', hi: 'आरंभ करने की तिथि:', te: 'ప్రారంభ తేదీ:' },
            { from: 'End Date:', key: 'serviceReq.endDate', en: 'End Date:', hi: 'अंतिम तिथि:', te: 'ముగింపు తేదీ:' },
            { from: 'Quantity:', key: 'serviceReq.quantity', en: 'Quantity:', hi: 'मात्रा:', te: 'పరిమాణం:' },
            { from: 'Status:', key: 'serviceReq.status', en: 'Status:', hi: 'स्थिति:', te: 'స్థితి:' },
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

    if (!content.includes('useTranslation')) {
        content = content.replace(/import .*?from '(lucide-react|react)';/, match => `import { useTranslation } from 'react-i18next';\n${match}`);
    }

    const componentRegex = /const (\w+) = \(\) => {/;
    if (!content.includes('const { t } = useTranslation();')) {
        content = content.replace(componentRegex, match => `${match}\n    const { t } = useTranslation();`);
    }

    fileObj.replacements.forEach(rep => {
        const keys = rep.key.split('.');
        const domain = keys[0];
        const key = keys[1];

        ['en', 'hi', 'te'].forEach(lang => {
            if (!locales[lang][domain]) locales[lang][domain] = {};
            locales[lang][domain][key] = rep[lang];
        });

        const escapedFrom = rep.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`>\\s*${escapedFrom}\\s*<`, 'g');
        content = content.replace(regex, `>{t('${rep.key}')}<`);
        
        const standaloneRegex = new RegExp(`(['"\`])${escapedFrom}\\1`, 'g');
        content = content.replace(standaloneRegex, `t('${rep.key}')`);
    });

    fs.writeFileSync(fileObj.file, content);
    console.log(`Updated ${fileObj.file}`);
}

filesToRefactor.forEach(processFile);

['en', 'hi', 'te'].forEach(lang => {
    const filePath = path.join(SRC_DIR, 'locales', lang, 'translation.json');
    if (fs.existsSync(filePath)) {
        const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
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
