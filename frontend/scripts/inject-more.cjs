const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '../src/locales');

const additionalTranslations = {
  hi: {
    varieties: {
      "FAQ": "सामान्य (FAQ)",
      "Medium": "मध्यम",
      "Local": "स्थानीय",
      "Other": "अन्य",
      "Hybrid": "हाइब्रिड",
      "Fine": "महीन",
      "Super Fine": "अति महीन",
      "Desi": "देसी",
      "Safeda": "सफेदा",
      "Bhagwa": "भगवा",
      "Red": "लाल",
      "White": "सफ़ेद",
      "Green": "हरा",
      "Black": "काला",
      "Small": "छोटा",
      "Large": "बड़ा"
    },
    grades: {
      "FAQ": "सामान्य (FAQ)",
      "Medium": "मध्यम",
      "Grade A": "ग्रेड A",
      "Grade B": "ग्रेड B",
      "Local": "स्थानीय"
    }
  },
  te: {
    varieties: {
      "FAQ": "సాధారణం (FAQ)",
      "Medium": "మధ్యస్థం",
      "Local": "స్థానికం",
      "Other": "ఇతర",
      "Hybrid": "హైబ్రిడ్",
      "Fine": "సన్నని",
      "Super Fine": "అమితమైన సన్నని",
      "Desi": "దేశీ",
      "Safeda": "సఫెదా",
      "Bhagwa": "భగ్వా",
      "Red": "ఎరుపు",
      "White": "తెలుపు",
      "Green": "ఆకుపచ్చ",
      "Black": "నలుపు",
      "Small": "చిన్న",
      "Large": "పెద్ద"
    },
    grades: {
      "FAQ": "సాధారణం (FAQ)",
      "Medium": "మధ్యస్థం",
      "Grade A": "గ్రేడ్ A",
      "Grade B": "గ్రేడ్ B",
      "Local": "స్థానికం"
    }
  }
};

['hi', 'te'].forEach(lang => {
  const tFile = path.join(localesPath, lang, 'translation.json');
  if (fs.existsSync(tFile)) {
    const data = JSON.parse(fs.readFileSync(tFile, 'utf8'));
    if (!data.marketPrices.varieties) data.marketPrices.varieties = {};
    if (!data.marketPrices.grades) data.marketPrices.grades = {};
    
    data.marketPrices.varieties = { ...data.marketPrices.varieties, ...additionalTranslations[lang].varieties };
    data.marketPrices.grades = { ...data.marketPrices.grades, ...additionalTranslations[lang].grades };
    
    fs.writeFileSync(tFile, JSON.stringify(data, null, 2));
  }
});
console.log('Additional translations injected.');
