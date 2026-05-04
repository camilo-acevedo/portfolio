import { useTranslation } from 'react-i18next';

export function useCvHref(): string {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? 'en').toLowerCase();
  return lang.startsWith('es') ? '/cv-es.pdf' : '/cv-en.pdf';
}
