import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES } from "@/i18n";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
}

export default function Header({ searchQuery, onSearchChange, onOpenCreate }: HeaderProps) {
  const { t, i18n } = useTranslation();

  return (
    <header className="border-b border-gray-100 pb-6 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="text-xl font-medium tracking-tight">{t("header.title")}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{t("header.subtitle")}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <input
          type="text"
          placeholder={t("header.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-64 text-xs bg-white border border-gray-100 rounded-md px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
        />
        <button
          onClick={onOpenCreate}
          className="w-full sm:w-auto text-xs font-medium px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          {t("header.addItem")}
        </button>

        <div
          role="group"
          aria-label={t("header.language")}
          className="flex text-[10px] font-mono border border-gray-100 rounded overflow-hidden"
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <button
              key={locale}
              lang={locale}
              aria-pressed={i18n.resolvedLanguage === locale}
              onClick={() => i18n.changeLanguage(locale)}
              className="px-2 py-2 uppercase cursor-pointer text-gray-400 hover:text-gray-700 aria-pressed:bg-gray-900 aria-pressed:text-white"
            >
              {/* Locale codes are shown as-is, so they read the same in every language */}
              {locale.split("-")[0]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
