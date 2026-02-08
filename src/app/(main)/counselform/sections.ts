'use client';

import { dynamicClient } from '@/utils/dynamic-client';

export const FormLayout = dynamicClient(() => import('./_components/form-layout'));

export const SubmitButton = dynamicClient(() => import('./_components/shared/submit-button'));
