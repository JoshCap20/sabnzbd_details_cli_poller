// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: ['dist/**', '**/*.d.ts', '**/*.js']
    },
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
);