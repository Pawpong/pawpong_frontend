import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MinimizeButton from './minimize-button';
import { CollapsibleProvider } from './collapsible-provider';
import { Collapsible } from '../ui/collapsible';

const meta = {
  title: 'components/filter-sidebar/minimize-button',
  component: MinimizeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CollapsibleProvider>
        <Collapsible>
          <Story />
        </Collapsible>
      </CollapsibleProvider>
    ),
  ],
} satisfies Meta<typeof MinimizeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    inverted: false,
  },
};

export const Inverted: Story = {
  args: {
    inverted: true,
  },
};
