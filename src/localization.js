const LANGUAGES_LIST = ["english", "tamil", "telugu", "malayalam"];

const RAW_LOCALIZATION = {
  title: {
    en: "AmritaTrees",
    ta: "அமிர்த மரங்கள்",
    te: "అమృత వృక్షాలు",
    ml: "അമൃത മരങ്ങൾ",
  },
  newUser: {
    en: "New User",
    ta: "புதிய பயனர்",
    te: "Kotta viniyōgadāru",
    ml: "പുതിയ ഉപയോക്താവ്",
  },
  landingTitle: {
    en: "Trees",
    ta: "மரங்கள்",
    te: "వృక్షాలు",
    ml: "മരങ്ങൾ",
  },
  landingSubtitle1: {
    en: "Who doesn't ❤️ Trees",
    ta: "மரங்களை யாருக்குத்தான் பிடிக்காது ❤️",
    te: "చెట్లను ఎవరు ఇష్టపడరు ❤️ ",
    ml: "ആരാണ് മരങ്ങളെ സ്നേഹിക്കാത്തത് ❤️ ",
  },
  landingSubtitle2: {
    en: "Come enjoy Geocaching with a twist",
    ta: "ஒரு திருப்பத்துடன் ஜியோகாச்சிங்கை அனுபவிக்க வாருங்கள்",
    te: "ట్విస్ట్‌తో జియోకాచింగ్‌ని ఆస్వాదించండి",
    ml: "ഒരു ട്വിസ്റ്റോടെ ജിയോകാച്ചിംഗ് ആസ്വദിക്കൂ",
  },
  letsStart: {
    en: "Let's Start",
    ta: "வாருங்கள் ஆரம்பிக்கலாம்",
    te: "రండి ప్రారంభిద్దాం",
    ml: "വരൂ നമുക്ക് തുടങ്ങാം",
  },
  exploreWorld: {
    en: "Explore your World",
    ta: "உங்கள் உலகத்தை ஆராயுங்கள்",
    te: "మీ ప్రపంచాన్ని అన్వేషించండి",
    ml: "നിങ്ങളുടെ ലോകം പര്യവേക്ഷണം ചെയ്യുക",
  },
  landingMsg1: {
    en: "Trees are a big part of our lives, and Amrita is full of them. This is an interactive online repository of all the trees, our contribution to one of the best things about this campus!",
    ta: "மரங்கள் நம் வாழ்வின் ஒரு பெரிய பகுதியாகும், அமிர்தம் அவற்றில் நிறைந்துள்ளது. இது அனைத்து மரங்களின் ஊடாடும் ஆன்லைன் களஞ்சியமாகும், இந்த வளாகத்தைப் பற்றிய சிறந்த விஷயங்களில் எங்கள் பங்களிப்பு!",
    te: "చెట్లు మన జీవితంలో పెద్ద భాగం, అమృతం వాటితో నిండి ఉంది. ఇది అన్ని చెట్ల యొక్క ఇంటరాక్టివ్ ఆన్‌లైన్ రిపోజిటరీ, ఈ క్యాంపస్ గురించిన అత్యుత్తమ విషయాలలో ఒకదానికి మా సహకారం!",
    ml: "മരങ്ങൾ നമ്മുടെ ജീവിതത്തിൻ്റെ ഒരു വലിയ ഭാഗമാണ്, അമൃത അവയിൽ നിറഞ്ഞിരിക്കുന്നു. ഇത് എല്ലാ മരങ്ങളുടെയും ഒരു സംവേദനാത്മക ഓൺലൈൻ ശേഖരമാണ്, ഈ കാമ്പസിലെ ഏറ്റവും മികച്ച കാര്യങ്ങളിലൊന്നിലേക്കുള്ള ഞങ്ങളുടെ സംഭാവന!",
  },
  landingMsg2: {
    en: "But that's not all, join the hunt in unlocking trees by finding them and answering a short quiz. Unlocking a tree gives you points, which can be redeemed for prizes. Explore the campus and enjoy the biodiversity it offers.",
    ta: "ஆனால் அதெல்லாம் இல்லை, மரங்களைக் கண்டுபிடித்து ஒரு சிறிய வினாடி வினாவுக்கு பதிலளிப்பதன் மூலம் அவற்றைத் திறப்பதில் வேட்டையில் சேரவும். ஒரு மரத்தைத் திறப்பது உங்களுக்கு புள்ளிகளை வழங்குகிறது, அதை பரிசுகளுக்காக மீட்டெடுக்கலாம். வளாகத்தை ஆராய்ந்து, அது வழங்கும் பல்லுயிரியலை அனுபவிக்கவும்.",
    te: "కానీ అంతే కాదు, చెట్లను కనుగొని, చిన్న క్విజ్‌కి సమాధానం ఇవ్వడం ద్వారా వాటిని అన్‌లాక్ చేయడంలో వేటలో చేరండి. చెట్టును అన్‌లాక్ చేయడం వలన మీకు పాయింట్‌లు లభిస్తాయి, వీటిని బహుమతుల కోసం రీడీమ్ చేయవచ్చు. క్యాంపస్‌ను అన్వేషించండి మరియు అది అందించే జీవవైవిధ్యాన్ని ఆస్వాదించండి.",
    ml: "എന്നാൽ അത് മാത്രമല്ല, മരങ്ങളെ കണ്ടെത്തി ഒരു ചെറിയ ക്വിസിന് ഉത്തരം നൽകി അൺലോക്ക് ചെയ്യുന്നതിൽ വേട്ടയിൽ ചേരുക. ഒരു ട്രീ അൺലോക്ക് ചെയ്യുന്നത് നിങ്ങൾക്ക് പോയിൻ്റുകൾ നൽകുന്നു, അത് സമ്മാനങ്ങൾക്കായി റിഡീം ചെയ്യാവുന്നതാണ്. കാമ്പസ് പര്യവേക്ഷണം ചെയ്യുകയും അത് പ്രദാനം ചെയ്യുന്ന ജൈവവൈവിധ്യം ആസ്വദിക്കുകയും ചെയ്യുക.",
  },
  landingMsg3: {
    en: "The game is simple, walk up to a tree, and tap on its icon on the map. If you're able to correctly answer the question that pops on your screen, you unlock that tree and it gets added to your inventory. All the best!",
    ta: "விளையாட்டு எளிமையானது, ஒரு மரத்தின் மீது நடந்து, வரைபடத்தில் அதன் ஐகானைத் தட்டவும். உங்கள் திரையில் தோன்றும் கேள்விக்கு உங்களால் சரியாக பதிலளிக்க முடிந்தால், அந்த மரத்தைத் திறக்கவும், அது உங்கள் சரக்குகளில் சேர்க்கப்படும். வாழ்த்துகள்!",
    te: "గేమ్ సరళమైనది, చెట్టు వరకు నడవండి మరియు మ్యాప్‌లోని దాని చిహ్నంపై నొక్కండి. మీ స్క్రీన్‌పై కనిపించే ప్రశ్నకు మీరు సరిగ్గా సమాధానం చెప్పగలిగితే, మీరు ఆ చెట్టును అన్‌లాక్ చేసి, అది మీ ఇన్వెంటరీకి జోడించబడుతుంది. అంతా మంచి జరుగుగాక!",
    ml: "ഗെയിം ലളിതമാണ്, ഒരു മരത്തിലേക്ക് നടന്ന്, മാപ്പിലെ അതിൻ്റെ ഐക്കണിൽ ടാപ്പുചെയ്യുക. നിങ്ങളുടെ സ്‌ക്രീനിൽ പ്രത്യക്ഷപ്പെടുന്ന ചോദ്യത്തിന് ശരിയായി ഉത്തരം നൽകാൻ നിങ്ങൾക്ക് കഴിയുമെങ്കിൽ, നിങ്ങൾ ആ ട്രീ അൺലോക്ക് ചെയ്യുകയും അത് നിങ്ങളുടെ ഇൻവെൻ്ററിയിലേക്ക് ചേർക്കുകയും ചെയ്യും. എല്ലാ ആശംസകളും!",
  },
  landingFigureCaption: {
    en: "Our Campus transformation.",
    ta: "எங்கள் கல்லூரி மாற்றம்.",
    te: "మా క్యాంపస్ పరివర్తన.",
    ml: "ഞങ്ങളുടെ കാമ്പസ് പരിവർത്തനം.",
  },
};

function convertLocalizationFormat(oldFormat) {
  const newFormat = {};

  // Iterate through each key in the old format
  for (const key in oldFormat) {
    // Iterate through each language code in the current key
    for (const lang in oldFormat[key]) {
      // Initialize the language key in the new format if it doesn't exist
      if (!newFormat[lang]) {
        newFormat[lang] = {};
      }
      // Assign the value to the appropriate place in the new format
      newFormat[lang][key] = oldFormat[key][lang];
    }
  }

  return newFormat;
}

const LOCALIZATION = convertLocalizationFormat(RAW_LOCALIZATION);

async function getIndiaTime() {
  const response = await fetch(
    "https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata"
  );
  return await response.json();
}

function getSunIndex(hours) {
  if (hours < 6) {
    return 0;
  } else if (hours < 10) {
    return 1;
  } else if (hours < 12) {
    return 2;
  } else if (hours < 13) {
    return 3;
  } else if (hours < 15) {
    return 4;
  } else if (hours < 17) {
    return 5;
  } else if (hours < 19) {
    return 6;
  } else if (hours < 22) {
    return 7;
  } else {
    return 8;
  }
}

function getTimeIcon(idx) {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="w-6 h-6"
      viewBox="0 0 16 16"
    >
      <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
    </svg>`;
}

module.exports = {
  LANGUAGES_LIST,
  LOCALIZATION,
  getIndiaTime,
  getSunIndex,
  getTimeIcon,
};
