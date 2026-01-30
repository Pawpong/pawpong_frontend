/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { LoadingText } from '@/components/dynamic-loading';

export const dynamicClient = (importer: () => Promise<any>) =>
  dynamic(importer, {
    ssr: false,
    loading: LoadingText,
  }) as ComponentType<any>;
