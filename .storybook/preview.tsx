import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationGuardProvider } from '../src/contexts/navigation-guard-context';
import '../src/app/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <NavigationGuardProvider>
          <div className="font-pretendard">
            <Story />
          </div>
        </NavigationGuardProvider>
      </QueryClientProvider>
    ),
  ],
};

export default preview;
