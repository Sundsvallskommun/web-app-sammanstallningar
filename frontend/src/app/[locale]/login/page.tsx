'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import { Button, FormErrorMessage } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import { appURL } from '@utils/app-url';
import { useT } from 'next-i18next/client';
import { useEffect, useRef, useState } from 'react';
import { capitalize } from 'underscore.string';

export default function Start() {
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const { t } = useT();

  const params = new URLSearchParams(globalThis.location.search);
  const failMessage = params.get('failMessage');
  // Turn on/off automatic login
  const autoLogin = true;

  const initalFocus = useRef<HTMLButtonElement>(null);

  const setInitalFocus = () => {
    setTimeout(() => {
      initalFocus?.current?.focus?.();
    });
  };

  const onLogin = () => {
    const path = new URLSearchParams(globalThis.location.search).get('path') || '';

    const url = new URL(apiURL('/saml/login'));
    const queries = new URLSearchParams({
      successRedirect: `${appURL(path)}`,
      failureRedirect: `${appURL()}/login`,
    });
    url.search = queries.toString();
    // NOTE: send user to login with SSO
    globalThis.location.href = url.toString();
  };

  useEffect(() => {
    setInitalFocus();
    setTimeout(() => setMounted(true), 500); // to not flash the login-screen on autologin

    if (!failMessage && autoLogin) {
      // autologin
      onLogin();
    } else if (failMessage) {
      setErrorMessage(t(`login:errors.${failMessage}`, 'Okänt fel vid inloggning, försök igen.'));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted && !failMessage) {
    // to not flash the login-screen on autologin
    return <LoaderFullScreen />;
  }

  return (
    <EmptyLayout>
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-[80rem] grow-0 w-full flex flex-col text-light-primary bg-inverted-background-content p-24 shadow-lg text-left">
            <div className="mb-14">
              <h1 className="mb-10 text-xl">{t('common:app_name')}</h1>
              <p className="my-0">{t('login:description')}</p>
            </div>

            <Button inverted onClick={() => onLogin()} ref={initalFocus} data-cy="loginButton">
              {capitalize(t('common:login'))}
            </Button>

            {errorMessage && <FormErrorMessage className="mt-lg">{errorMessage}</FormErrorMessage>}
          </div>
        </div>
      </main>
    </EmptyLayout>
  );
}
