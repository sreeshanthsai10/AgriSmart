const fs = require('fs');
const filepath = 'c:/Users/srees/.gemini/antigravity/scratch/agrismart/frontend/src/pages/ServiceRequests.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const regexToRemove = /const statusConfig = {[\s\S]*?};\n/;
content = content.replace(regexToRemove, '');

const regexToInsert = /const { t } = useTranslation\(\);\n/;
content = content.replace(regexToInsert, `const { t } = useTranslation();\n\n    const statusConfig = {\n        pending: { label: t('serviceReq.pending'), color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },\n        accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },\n        rejected: { label: t('serviceReq.rejected'), color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle },\n        completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },\n    };\n`);

fs.writeFileSync(filepath, content);
console.log('Fixed ServiceRequests.jsx');
