import type { StorybookConfig } from '@storybook/nextjs-vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-onboarding'],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  async viteFinal(config) {
    const srcDir = path.resolve(__dirname, '..', 'src');

    // Custom SVG plugin that converts .svg imports to React components
    // This matches Next.js @svgr/webpack behavior
    // Must intercept BEFORE @storybook/nextjs-vite's next-image handler
    const customSvgPlugin = {
      name: 'custom-svgr',
      enforce: 'pre' as const,
      async resolveId(source: string, importer: string | undefined) {
        // Skip virtual modules
        if (!source || source.startsWith('\0') || source.includes('virtual:')) {
          return null;
        }
        if (!source.endsWith('.svg')) {
          return null;
        }

        // Resolve the actual file path
        let filePath: string;
        if (path.isAbsolute(source)) {
          filePath = source;
        } else if (source.startsWith('@/')) {
          filePath = path.resolve(srcDir, source.slice(2));
        } else if (importer) {
          const importerPath = importer.replace(/[?#].*$/, '');
          filePath = path.resolve(path.dirname(importerPath), source);
        } else {
          return null;
        }

        // Check if file exists
        try {
          await fs.promises.access(filePath);
          return filePath + '?svgr';
        } catch {
          return null;
        }
      },
      async load(id: string) {
        if (!id.endsWith('?svgr')) {
          return null;
        }

        const filePath = id.replace('?svgr', '');
        try {
          const { transform } = await import('@svgr/core');
          const jsx = (await import('@svgr/plugin-jsx')).default;
          const svgCode = await fs.promises.readFile(filePath, 'utf8');
          const componentCode = await transform(
            svgCode,
            {
              exportType: 'default',
              plugins: [jsx],
            },
            {
              filePath,
              caller: {
                defaultPlugins: [jsx],
              },
            },
          );
          const { transformWithEsbuild } = await import('vite');
          const res = await transformWithEsbuild(componentCode, filePath + '.jsx', {
            loader: 'jsx',
          });
          return { code: res.code, map: null };
        } catch (err) {
          console.error(`[custom-svgr] Error transforming ${filePath}:`, err);
          return null;
        }
      },
    };

    config.plugins = config.plugins || [];
    config.plugins.unshift(customSvgPlugin);

    return config;
  },
};
export default config;
