'use client';

import { ConfirmationDialogContextProvider } from '@sk-web-gui/react';
import { createContext, useContext, useState } from 'react';

export interface AppContextInterface {
  isCookieConsentOpen: boolean;
  setIsCookieConsentOpen: (isOpen: boolean) => void;

  setDefaults: () => void;
}

const AppContext = createContext<AppContextInterface>({
  isCookieConsentOpen: false,
  setIsCookieConsentOpen: () => {},
  setDefaults: () => {},
});

export function AppWrapper({ children }) {
  const contextDefaults = {
    isCookieConsentOpen: true,
  };
  const setDefaults = () => {
    setIsCookieConsentOpen(contextDefaults.isCookieConsentOpen);
  };
  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        isCookieConsentOpen,
        setIsCookieConsentOpen: (isOpen: boolean) => setIsCookieConsentOpen(isOpen),

        setDefaults,
      }}
    >
      <ConfirmationDialogContextProvider>{children}</ConfirmationDialogContextProvider>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
