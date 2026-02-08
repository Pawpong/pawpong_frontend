import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './visually-hidden';

const meta = {
  title: 'UI/VisuallyHidden',
  component: VisuallyHidden,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <p className="text-sm mb-2">아래에 스크린리더 전용 텍스트가 있습니다 (시각적으로는 보이지 않음):</p>
      <VisuallyHidden>이 텍스트는 스크린리더에서만 읽힙니다</VisuallyHidden>
      <p className="text-xs text-gray-400 mt-2">→ VisuallyHidden은 접근성을 위한 컴포넌트로, 화면에 보이지 않습니다.</p>
    </div>
  ),
};
