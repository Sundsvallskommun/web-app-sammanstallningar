'use client';

import { useUserStore } from '@services/user-service/user-service';
import { Footer, Header, Logo, UserMenu } from '@sk-web-gui/react';
import { useT } from 'next-i18next/client';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
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
  children,
  preContent = undefined,
  postContent = undefined,
  logoLinkHref = '/',
}: DefaultLayoutProps) {
  const router = useRouter();

  const user = useUserStore(useShallow((s) => s.user));

  const { t } = useT();

  const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    contentElement?.focus();
  };

  const handleLogoClick = () => {
    router.push(logoLinkHref);
  };

  return (
    <div className="DefaultLayout full-page-layout">
      <div className="flex z-40 shadow-100">
        <NextLink onClick={setFocusToMain} className="next-link-a" href="#content" data-cy="systemMessage-a">
          {t('layout:header.goto_content')}
        </NextLink>

        <Header
          data-cy="nav-header"
          title={t('common:app_name')}
          subtitle="Sundsvalls kommun"
          aria-label={t('common:app_name')}
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
    </div>
  );
}
