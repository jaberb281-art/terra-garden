import { defineConfig, globalIgnores } from 'eslint/config';
import vitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';
export default defineConfig([
  ...vitals,
  ...typescript,
  { files: ['tests/**/*.cjs'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
  globalIgnores(['.next/**', '.qa/**', 'next-env.d.ts', 'test-results/**']),
]);
