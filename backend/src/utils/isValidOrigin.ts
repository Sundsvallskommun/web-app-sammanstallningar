import { ORIGIN } from '@/config';

const allowedOrigins = (): string[] =>
  (ORIGIN ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin !== '');

export const isValidOrigin = (url: string): boolean => {
  const origin = new URL(url).origin;
  return allowedOrigins().includes(origin);
};

export const getAllowedRedirectUrl = (candidate: unknown): URL | null => {
  if (typeof candidate !== 'string' || candidate === '') {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null;
  }

  const allowedOrigin = allowedOrigins().find(origin => origin === parsed.origin);
  if (!allowedOrigin) {
    return null;
  }

  const safeUrl = new URL(allowedOrigin);
  safeUrl.pathname = parsed.pathname;
  safeUrl.search = parsed.search;
  return safeUrl;
};
