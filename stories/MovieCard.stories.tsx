import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MovieCard } from '../components/MovieCard';
import type { Movie } from '../types';

const movie: Movie = {
  id: 603,
  title: 'The Matrix',
  original_title: 'The Matrix',
  poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  backdrop_path: '/icmmSD4vTTDKOq2vvdulafOGw93.jpg',
  release_date: '1999-03-30',
  vote_average: 8.2,
  vote_count: 26000,
  overview: 'A computer hacker discovers a hidden reality and joins a rebellion against its controllers.',
  genre_ids: [28, 878],
};

const meta = {
  title: 'Core/MovieCard',
  component: MovieCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    movie,
    isFavorite: false,
    onToggleFavorite: () => undefined,
  },
} satisfies Meta<typeof MovieCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Favorite: Story = { args: { isFavorite: true } };
