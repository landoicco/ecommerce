import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import esMX from "./locales/es-MX.json";

export const resources = {
  en: { translation: en },
  "es-MX": { translation: esMX },
} as const;

export type Locale = keyof typeof resources;
export const SUPPORTED_LOCALES = Object.keys(resources) as Locale[];

const STORAGE_KEY = "locale";

function isSupported(value: unknown): value is Locale {
  return typeof value === "string" && value in resources;
}

// The deployment decides the default (es-MX for a Mexican marketplace), not the browser:
// customers expect the marketplace's language even on a phone set to English
const DEFAULT_LOCALE: Locale = isSupported(import.meta.env.VITE_DEFAULT_LOCALE)
  ? import.meta.env.VITE_DEFAULT_LOCALE
  : "en";

// Storage can be unavailable (private mode, blocked site data); the default still works
function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isSupported(stored) ? stored : null;
  } catch {
    return null;
  }
}

i18n.on("languageChanged", (lng) => {
  // Screen readers and the browser's hyphenation rely on the page language
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // The choice just won't survive a reload
  }
});

i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLocale() ?? DEFAULT_LOCALE,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LOCALES,
  interpolation: {
    // React already escapes rendered values
    escapeValue: false,
  },
});

export default i18n;
