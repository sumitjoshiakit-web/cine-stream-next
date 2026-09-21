import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../components/Button';

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Choose the button visual variant.',
    },
    disabled: {
      control: 'boolean',
      description: 'Toggle the disabled state.',
    },
  },
  args: {
    children: 'Watch now',
    variant: 'primary',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { disabled: true } };
