import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./translations/en";
import { pl } from "./translations/pl";

i18next.use(initReactI18next).init({
  lng: localStorage.getItem("i18n"),
  fallbackLng: "en",
  resources: {
    en: {
      translation: en,
    },
    pl: {
      translation: pl,
    },
  },
});
