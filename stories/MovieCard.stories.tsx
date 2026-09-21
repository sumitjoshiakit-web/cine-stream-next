import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { MovieCard } from '../components/MovieCard';
import { MOCK_MOVIES } from '../data/mockMovies';

// This is the REAL MovieCard component used in the running app (app/page.tsx →
// AppShell → MovieGrid → MovieCard) — rendered here fully decoupled from
// Next.js routing/data-fetching, using mock data and mock callbacks instead.
const sampleMovie = MOCK_MOVIES[0];

const meta = {
  title: 'App/MovieCard',
  component: MovieCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isFavorite: {
      control: 'boolean',
      description: 'Whether the heart icon renders in its active ("favorited") state.',
    },
  },
  args: {
    movie: sampleMovie,
    onToggleFavorite: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MovieCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isFavorite: false,
  },
};

export const Favorited: Story = {
  args: {
    isFavorite: true,
  },
};

export const HighlyRated: Story = {
  args: {
    movie: { ...sampleMovie, title: 'The Perfect Score', vote_average: 9.1, vote_count: 25000 },
    isFavorite: false,
  },
};

export const LowerRated: Story = {
  args: {
    movie: { ...sampleMovie, title: 'A Forgettable Sequel', vote_average: 4.3, vote_count: 120 },
    isFavorite: false,
  },
};
