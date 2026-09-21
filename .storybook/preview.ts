import type { Preview } from '@storybook/nextjs-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#09090b' },
        { name: 'light', value: '#f4f4f5' },
      ],
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { dark: 'dark', light: 'light' },
      defaultTheme: 'dark',
    }),
  ],
};

export default preview;
