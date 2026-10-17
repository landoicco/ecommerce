import "i18next";
import type en from "./locales/en.json";

// English is the reference catalog: t("a.missing.key") fails to compile
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
  }
}
