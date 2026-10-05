'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { ColorSchemeMode, GuiProvider } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(updateLocale);
dayjs.updateLocale('sv', {
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
});

interface ClientApplicationProps {
  children: ReactNode;
}

const AppLayout = ({ children }: ClientApplicationProps) => {
  const [mounted, setMounted] = useState(false);
  const user = useUserStore(useShallow((s) => s.user));
  const getMe = useUserStore(useShallow((s) => s.getMe));
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    getMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!mounted || (!user.name && !pathname.includes('/login'))) {
    return <LoaderFullScreen />;
  }

  return <GuiProvider colorScheme={ColorSchemeMode.System}>{children}</GuiProvider>;
};

export default AppLayout;
