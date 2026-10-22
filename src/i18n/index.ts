import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: 'vi',
  lng: 'vi',
  interpolation: { escapeValue: false },
  resources: {
    vi: {
      translation: {
        home: {
          title: 'Khám phá',
          subtitle: 'Chọn món phù hợp hôm nay',
          search: 'Tìm sản phẩm',
          featured: 'Sản phẩm chọn lọc',
        },
        account: { title: 'Tài khoản', language: 'Ngôn ngữ: Tiếng Việt' },
      },
    },
    en: {
      translation: {
        home: {
          title: 'Discover',
          subtitle: 'Find your next favorite',
          search: 'Search products',
          featured: 'Selected products',
        },
        account: { title: 'Account', language: 'Language: English' },
      },
    },
  },
});

export default i18n;