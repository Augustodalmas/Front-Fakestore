import i18n, { init } from 'i18next';
import { initReactI18next } from 'react-i18next';
import PTBR from './locales/pt/pt-br.json'
import ENUS from './locales/en/en-us.json'
import ESP from './locales/es/esp.json'

const resources = {
    "pt-BR":PTBR,
    "en-US":ENUS,
    'es': ESP
}

i18n.use(initReactI18next).init({
    resources,
    lng: navigator.language,
    interpoation: {
        escapeValue: false,
    }
})

export default i18n;