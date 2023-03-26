/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withPlugins([[withBundleAnalyzer], [withMDX]], {
  experimental: {
    appDir: true,
    mdxRs: true,
    fontLoaders: [{ loader: '@next/font/google', options: { subsets: ['latin'] } }],
  },
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // Optionally, add any other Next.js config below
  reactStrictMode: true,
});
