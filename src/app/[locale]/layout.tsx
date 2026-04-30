import { Inter, Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';

import { clsx } from 'clsx';
import { Locale, hasLocale, NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';

import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]'>, 'children'>,
) {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'home',
  });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
<html className={clsx('h-full bg-background', inter.variable, spaceGrotesk.variable)} lang={locale}>
      <body className='flex h-full flex-col font-sans'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
