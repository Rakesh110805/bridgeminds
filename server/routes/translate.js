// Translation Service - uses unofficial Google Translate URL (no API key needed)
// Falls back to MyMemory if Google fails.

const langCodeMap = {
    'Tamil': 'ta', 'Hindi': 'hi', 'Spanish': 'es', 'English': 'en',
    'French': 'fr', 'Swahili': 'sw', 'Telugu': 'te', 'Kannada': 'kn',
    'Bengali': 'bn', 'Marathi': 'mr', 'Punjabi': 'pa', 'Urdu': 'ur',
    'Arabic': 'ar', 'Portuguese': 'pt', 'Yoruba': 'yo', 'Zulu': 'zu',
    'Amharic': 'am', 'Hausa': 'ha', 'Igbo': 'ig', 'Somali': 'so',
    'Burmese': 'my', 'Thai': 'th', 'Vietnamese': 'vi', 'Indonesian': 'id',
    'Chinese (Mandarin)': 'zh-CN', 'Russian': 'ru', 'Turkish': 'tr',
    'Persian': 'fa', 'Pashto': 'ps', 'Malay': 'ms',
    'Javanese': 'jv', 'Oromo': 'om', 'Kinyarwanda': 'rw'
};

/**
 * Uses unofficial Google Translate endpoint (no key needed, works in demos).
 * Returns plain translated string.
 */
async function googleTranslateFree(text, fromCode, toCode) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromCode}&tl=${toCode}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Response format: [[[translated, original, null, null, null, null, null, []], ...]]
        let translated = '';
        if (Array.isArray(data[0])) {
            data[0].forEach(chunk => {
                if (chunk[0]) translated += chunk[0];
            });
        }
        if (translated && translated.trim()) {
            return translated.trim();
        }
    } catch (e) {
        console.warn('Google free translate error:', e.message);
    }
    return null; // signal failure
}

/**
 * MyMemory free API as a secondary fallback.
 */
async function myMemoryTranslate(text, fromCode, toCode) {
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromCode}|${toCode}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const data = await res.json();
        const translated = data?.responseData?.translatedText;
        if (translated && translated !== text && !translated.toLowerCase().startsWith('must be')) {
            return translated;
        }
    } catch (e) {
        console.warn('MyMemory fallback timeout/error:', e.message);
    }
    return null;
}

/**
 * Translate text to a target language name (e.g., 'Tamil', 'Hindi')
 */
async function translateText(text, targetLangName) {
    if (!text || !text.trim()) return '';
    const targetCode = langCodeMap[targetLangName];
    if (!targetCode || targetCode === 'en') return text;

    // 1. Try official Google Cloud if key set
    const key = process.env.GOOGLE_TRANSLATE_KEY || process.env.GOOGLE_TRANSLATE_API_KEY;
    if (key) {
        try {
            const { Translate } = require('@google-cloud/translate').v2;
            const gt = new Translate({ key });
            const [result] = await gt.translate(text, targetCode);
            if (result) return result;
        } catch (e) {
            console.warn('Google Cloud Translate failed:', e.message);
        }
    }

    // 2. Try free Google Translate endpoint
    const r1 = await googleTranslateFree(text, 'en', targetCode);
    if (r1) return r1;

    // 3. MyMemory fallback
    const r2 = await myMemoryTranslate(text, 'en', targetCode);
    if (r2) return r2;

    return text; // last resort: return original
}

/**
 * Translate any language text INTO English
 */
async function translateToEnglish(text, fromLangName) {
    if (!text || !text.trim()) return '';
    const fromCode = langCodeMap[fromLangName] || 'auto';
    if (fromCode === 'en') return text;

    // 1. Try official Google Cloud if key set
    const key = process.env.GOOGLE_TRANSLATE_KEY || process.env.GOOGLE_TRANSLATE_API_KEY;
    if (key) {
        try {
            const { Translate } = require('@google-cloud/translate').v2;
            const gt = new Translate({ key });
            const [result] = await gt.translate(text, 'en');
            if (result) return result;
        } catch (e) {
            console.warn('Google Cloud Translate failed:', e.message);
        }
    }

    // 2. Try free Google Translate endpoint
    const r1 = await googleTranslateFree(text, fromCode, 'en');
    if (r1) return r1;

    // 3. MyMemory fallback
    const r2 = await myMemoryTranslate(text, fromCode, 'en');
    if (r2) return r2;

    return text;
}

module.exports = { translateText, translateToEnglish, langCodeMap };
