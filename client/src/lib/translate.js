// Client-side translation utility - runs in browser (unrestricted network)
// Uses unofficial Google Translate endpoint (no API key needed)

const LANG_CODES = {
    'Tamil': 'ta', 'Hindi': 'hi', 'Spanish': 'es', 'English': 'en',
    'French': 'fr', 'Swahili': 'sw', 'Telugu': 'te', 'Kannada': 'kn',
    'Bengali': 'bn', 'Marathi': 'mr', 'Punjabi': 'pa', 'Urdu': 'ur',
    'Arabic': 'ar', 'Portuguese': 'pt', 'Yoruba': 'yo', 'Zulu': 'zu',
    'Amharic': 'am', 'Hausa': 'ha', 'Igbo': 'ig', 'Somali': 'so',
    'Burmese': 'my', 'Thai': 'th', 'Vietnamese': 'vi', 'Indonesian': 'id',
    'Chinese (Mandarin)': 'zh-CN', 'Russian': 'ru', 'Turkish': 'tr',
    'Persian': 'fa', 'Malay': 'ms'
};

/**
 * Translate text using the free Google Translate API (browser-side)
 * @param {string} text - text to translate
 * @param {string} fromLang - source language name ('Tamil', 'Hindi', etc.)
 * @param {string} toLang - target language name ('English', 'Tamil', etc.)
 * @returns {Promise<string>} translated text
 */
export async function translateText(text, fromLang, toLang = 'English') {
    if (!text || !text.trim()) return '';
    const fromCode = LANG_CODES[fromLang] || 'auto';
    const toCode = LANG_CODES[toLang] || 'en';
    if (fromCode === toCode) return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromCode}&tl=${toCode}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let translated = '';
        if (Array.isArray(data[0])) {
            data[0].forEach(chunk => { if (chunk[0]) translated += chunk[0]; });
        }
        if (translated.trim()) return translated.trim();
    } catch (e) {
        console.warn('Client translate error:', e.message);
    }

    // Fallback: return original text
    return text;
}

/**
 * Translate text to English from a given language
 */
export async function translateToEnglish(text, fromLang) {
    return translateText(text, fromLang, 'English');
}

/**
 * Translate English text to a target language
 */
export async function translateFromEnglish(text, toLang) {
    return translateText(text, 'English', toLang);
}

export { LANG_CODES };
