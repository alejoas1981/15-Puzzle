import {useState, useEffect} from 'react';
import {Language, detectBrowserLanguage, getTranslation} from '@/lib/i18n';

export function useI18n() {
    const [language, setLanguage] = useState<Language>(() => detectBrowserLanguage());

    useEffect(() => {
        // Re-detect language on mount in case it changed
        setLanguage(detectBrowserLanguage());
    }, []);

    const t = (key: string): string => {
        return getTranslation(language, key);
    };

    return {
        language,
        setLanguage,
        t
    };
}