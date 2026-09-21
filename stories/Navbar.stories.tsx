import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Navbar } from '../components/Navbar';

const meta = {
  title: 'Core/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    activeView: {
      control: 'inline-radio',
      options: ['discover', 'favorites'],
    },
    favoritesCount: {
      control: { type: 'number', min: 0, max: 99, step: 1 },
    },
    isDemoMode: { control: 'boolean' },
  },
  args: {
    searchQuery: '',
    onSearchChange: () => undefined,
    onClearSearch: () => undefined,
    isDebouncing: false,
    favoritesCount: 3,
    activeView: 'discover',
    onViewChange: () => undefined,
    isDemoMode: false,
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FavoritesActive: Story = { args: { activeView: 'favorites' } };
