module.exports = {
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  quoteProps: 'as-needed',
  arrowParens: 'avoid',
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  semi: true,
  jsxSingleQuote: false,
  jsxBracketSameLine: false,
  importOrder: [
    // add other aliases here
    '^@/api/(.*)$',
    '^@/models/(.*)$',
    '^@/contexts/(.*)$',
    '^@/hooks/(.*)$',
    '^@/services/(.*)$',
    '^@/utils/(.*)$',
    '^@/features/(.*)$',
    '^@/components/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/types/(.*)$',
    '^@/constants',
    '^@/settings',
  ],
  importOrderSeparation: false,
  plugins: [
    require.resolve('@trivago/prettier-plugin-sort-imports'),
    require('prettier-plugin-tailwindcss'),
  ],
};
