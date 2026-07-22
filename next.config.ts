import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators:false,
  webpack(config) {
    // Grab the internal Webpack rule type mapped directly from Next.js types
    type WebpackRule = NonNullable<NonNullable<typeof config.module>['rules']>[number];

    const fileLoaderRule = config.module?.rules?.find(
      (rule: any) => rule && typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('.svg')
    ) as WebpackRule | undefined;

    if (fileLoaderRule && typeof fileLoaderRule === 'object') {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: {
            not: [
              ...(fileLoaderRule.resourceQuery && typeof fileLoaderRule.resourceQuery === 'object' && 'not' in fileLoaderRule.resourceQuery && Array.isArray(fileLoaderRule.resourceQuery.not)
                ? fileLoaderRule.resourceQuery.not
                : []),
              /url/
            ],
          },
          use: ['@svgr/webpack'],
        }
      );

      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
