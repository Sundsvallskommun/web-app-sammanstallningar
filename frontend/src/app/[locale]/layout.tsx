import LocalizationProvider from '@components/localization-provider/localization-provider';
import { headers } from 'next/headers';
import { ReactNode } from 'react';
import initLocalization from '../i18n';

export interface LocalizationLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

const namespaces = ['common', 'paths', 'login', 'layout', 'step'];

const LocalizationLayout = async (props: LocalizationLayoutProps) => {
  const { params, children } = props;
  const { locale } = await params;
  const { resources } = await initLocalization(locale, namespaces);

  return <LocalizationProvider {...{ locale, resources, namespaces }}>{children}</LocalizationProvider>;
};

export const generateMetadata = async ({ params }: LocalizationLayoutProps) => {
  const { locale } = await params;
  const { t } = await initLocalization(locale, namespaces);
  const path = (await headers()).get('x-path');

  const pathName =
    path
      ?.replace(/^\/?/, '') // Remove leading slash
      .split('/') // Split into sections
      .map(
        (s) =>
          `${s.substring(0, 1).toUpperCase()}${s.substring(1)}` // Capitalize the first letter
            .replace('-', ' ') // Replace separators
      )
      .join(', ') ?? null;
  // Comma separate sections

  const getTitle = () => {
    if (path) {
      return `${t(`paths:${path}.title`, { defaultValue: pathName })} - ${t('common:app_name')}`;
    }
    return t('common:app_name');
  };

  const description = t(`paths:${path}.description`, { defaultValue: '' });

  return {
    title: {
      default: getTitle(),
      template: `%s - ${t('common:app_name')}`,
    },
    description,
  };
};

export default LocalizationLayout;
