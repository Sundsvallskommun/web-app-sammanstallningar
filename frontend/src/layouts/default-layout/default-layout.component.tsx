import { CookieConsent, Footer, Header, Link, Logo, UserMenu } from '@sk-web-gui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useUserStore } from '@services/user-service/user-service';
import { useShallow } from 'zustand/react/shallow';

interface DefaultLayoutProps {
  children: React.ReactNode;
  title?: string;
  postTitle?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
  logoLinkHref?: string;
}

export default function DefaultLayout({
  title,
  postTitle,
  headerTitle,
  headerSubtitle,
  children,
  preContent = undefined,
  postContent = undefined,
  logoLinkHref = '/',
}: DefaultLayoutProps) {
  const router = useRouter();
  const layoutTitle = `${process.env.NEXT_PUBLIC_APP_NAME}${headerSubtitle ? ` - ${headerSubtitle}` : ''}`;
  const fullTitle = postTitle ? `${layoutTitle} - ${postTitle}` : `${layoutTitle}`;
  const user = useUserStore(useShallow((s) => s.user));

  const { t } = useTranslation();

  const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    contentElement.focus();
  };

  const handleLogoClick = () => {
    router.push(logoLinkHref);
  };

  return (
    <div className="DefaultLayout full-page-layout">
      <div className="flex z-40 shadow-100">
        <Head>
          <title>{title ? title : fullTitle}</title>
          <meta name="description" content={`${process.env.NEXT_PUBLIC_APP_NAME}`} />
        </Head>

        <NextLink onClick={setFocusToMain} className="next-link-a" href="#content" data-cy="systemMessage-a">
          {t('layout:header.goto_content')}
        </NextLink>

        <Header
          data-cy="nav-header"
          title={headerTitle ? headerTitle : process.env.NEXT_PUBLIC_APP_NAME}
          subtitle="Sundsvalls kommun"
          aria-label={`${headerTitle ? headerTitle : process.env.NEXT_PUBLIC_APP_NAME} ${headerSubtitle}`}
          logoLinkOnClick={handleLogoClick}
        >
          <UserMenu
            initials={`${user.givenName?.[0]}${user.surname?.[0]}`}
            menuTitle={`${user.name} (${user.username})`}
            menuGroups={[]}
          />
        </Header>
      </div>

      {preContent && preContent}

      <div className="flex-grow relative w-full flex flex-col">{children}</div>

      {postContent && postContent}

      <Footer className="bg-inverted-black justify-start">
        <Footer.Content>
          <Footer.LogoWrapper>
            <Logo aria-label="Sundsvalls kommun logotyp" inverted />
          </Footer.LogoWrapper>
        </Footer.Content>
      </Footer>

      <CookieConsent
        title={t('layout:cookies.title', { app: process.env.NEXT_PUBLIC_APP_NAME })}
        body={
          <p>
            {t('layout:cookies.description')}{' '}
            <NextLink href="/kakor">
              <Link>{t('layout:cookies.read_more')}</Link>
            </NextLink>
          </p>
        }
        cookies={[
          {
            optional: false,
            displayName: t('layout:cookies.necessary.displayName'),
            description: t('layout:cookies.necessary.description'),
            cookieName: 'necessary',
          },
          {
            optional: true,
            displayName: t('layout:cookies.func.displayName'),
            description: t('layout:cookies.func.description'),
            cookieName: 'func',
          },
          {
            optional: true,
            displayName: t('layout:cookies.stats.displayName'),
            description: t('layout:cookies.stats.description'),
            cookieName: 'stats',
          },
        ]}
        resetConsentOnInit={false}
        onConsent={() => {
          // FIXME: do stuff with cookies?
          // NO ANO FUNCTIONS
        }}
      />
    </div>
  );
}
