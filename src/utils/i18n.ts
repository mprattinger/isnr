import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend, { HttpBackendOptions } from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    interpolation: {
      escapeValue: false,
    },
    ns: ["common", "profid"],
    defaultNS: "common",
    fallbackLng: "de",
  });

export default i18n;
