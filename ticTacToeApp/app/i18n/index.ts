import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager, Platform } from "react-native";
import RNRestart from "react-native-restart";

import en from "./translations/en.json";
import ar from "./translations/ar.json";

import languages from "../config/languages";

const LANGUAGE_KEY = "appLanguage";

const LANGUAGE_DETECTOR = {
  type: "languageDetector",
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (storedLang) {
      callback(storedLang);
    } else {
      const bestLang = RNLocalize.findBestLanguageTag([languages.en.short, languages.ar.short]);
      callback(bestLang?.languageTag || languages.en.short);
    }
  },
  init: () => {},
  cacheUserLanguage: (lang: string) => {
    AsyncStorage.setItem(LANGUAGE_KEY, lang);
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    fallbackLng: languages.en.short,
    compatibilityJSON: "v4",
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    react: {
      useSuspense: false,
    },
  });

export const changeAppLanguage = async (lang: "en" | "ar") => {
  const isRTL = lang === languages.ar.short;

  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);

    // Reload app to apply new layout
    if (Platform.OS === "android") {
      RNLocalize.getLocales(); // dummy call
      setTimeout(() => {
        // Use a native module to restart app if needed
        RNRestart.restart(); // <-- use react-native-restart
      }, 500);
    } else {
      RNRestart.restart();
    }
  }
};

export default i18n;
