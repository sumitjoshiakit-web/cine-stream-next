import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Button } from '../components/ui/Button';

const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // Every one of these becomes a live control in the Storybook "Controls"
  // panel, so a reviewer can toggle Primary ↔ Secondary and flip Disabled
  // on/off without touching code.
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style of the button.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
      description: 'Renders the button in a muted, non-interactive Disabled state.',
    },
    children: {
      control: 'text',
      description: 'Button label.',
    },
  },
  args: {
    onClick: fn(),
    children: 'Watch Now',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- State Variants (Phase 2 requirement) ---------------------------------

export const Primary: Story = {
  args: {
    variant: 'primary',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    disabled: false,
    children: 'Add to Watchlist',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Sold Out',
  },
};

// A single interactive playground story: use the Controls panel below to flip
// `variant` between primary/secondary and toggle `disabled` live.
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: 'Customize me via Controls →',
  },
};
