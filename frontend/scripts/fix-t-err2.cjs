const fs = require('fs');

const filepath = 'c:/Users/srees/.gemini/antigravity/scratch/agrismart/frontend/src/pages/ServiceRequests.jsx';
let content = fs.readFileSync(filepath, 'utf8');

// The block to remove
const targetOriginal = `const statusConfig = {
    pending: { label: t('serviceReq.pending'), color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    rejected: { label: t('serviceReq.rejected'), color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
};`;

// Strip all carriage returns to make matching easier
content = content.replace(/\r/g, '');

const regexToRemove = /const statusConfig = \{[\s\S]*?\};\n*/;
content = content.replace(regexToRemove, '');

const insertRegex = /const \{ t \} = useTranslation\(\);\n/;
const insertText = `const { t } = useTranslation();

    const statusConfig = {
        pending: { label: t('serviceReq.pending'), color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
        accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
        rejected: { label: t('serviceReq.rejected'), color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle },
        completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
    };\n`;

content = content.replace(insertRegex, insertText);

fs.writeFileSync(filepath, content);
console.log('Fixed completely!');
