import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from '../components/ui/Badge';

const meta = {
  title: 'Design System/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'disabled'],
    },
    label: { control: 'text' },
    withIcon: { control: 'boolean' },
  },
  args: {
    label: 'Action',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', label: 'Featured' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Sci-Fi' },
};

export const Disabled: Story = {
  args: { variant: 'disabled', label: 'Unavailable' },
};

export const RatingWithIcon: Story = {
  args: { variant: 'success', label: '8.2', withIcon: true },
};
