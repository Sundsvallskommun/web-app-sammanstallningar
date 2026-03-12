const envalid = require('envalid');

const authDependent = envalid.makeValidator((x) => {
  const authEnabled = process.env.HEALTH_AUTH === 'true';

  if (authEnabled && !x.length) {
    throw new Error(`Can't be empty if "HEALTH_AUTH" is true`);
  }

  return x;
});

envalid.cleanEnv(process.env, {
  NEXT_PUBLIC_API_URL: envalid.str(),
  HEALTH_AUTH: envalid.bool(),
  HEALTH_USERNAME: authDependent(),
  HEALTH_PASSWORD: authDependent(),
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const domainName = process.env.DOMAIN_NAME;
const shouldUseStandaloneOutput = process.env.NEXT_OUTPUT === 'standalone';

module.exports = withBundleAnalyzer({
  output: shouldUseStandaloneOutput ? 'standalone' : undefined,
  images: {
    remotePatterns: domainName
      ? [
          {
            protocol: 'https',
            hostname: domainName,
          },
          {
            protocol: 'http',
            hostname: domainName,
          },
        ]
      : [],
    formats: ['image/avif', 'image/webp'],
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sassOptions: {
    prependData: `$basePath: '${process.env.NEXT_PUBLIC_BASE_PATH}';`,
  },
  transpilePackages: ['lucide-react', '@sk-web-gui/react', '@sk-web-gui/core', '@sk-web-gui/next', '@sk-web-gui/ai'],
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  experimental: {
    optimizePackageImports: ['@sk-web-gui', 'lucide-react'],
  },
  async rewrites() {
    return [{ source: '/napi/:path*', destination: '/api/:path*' }];
  },
});
