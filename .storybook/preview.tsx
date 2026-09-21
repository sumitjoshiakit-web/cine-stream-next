import type { Preview } from '@storybook/nextjs-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },

    // Lets each story preview on a light or dark canvas independent of the
    // "dark" class toggle below — handy for components that don't use
    // Tailwind's `dark:` variants at all (e.g. the always-dark MovieCard).
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#09090b' },
        light: { name: 'Light', value: '#f4f4f5' },
      },
    },
    initialGlobals: {
      backgrounds: { value: 'dark' },
    },
  },

  // Adds a "theme" toolbar toggle (Light / Dark) in the Storybook UI. Selecting
  // a theme toggles the `dark` class on <html>, which Tailwind's `dark:`
  // variants (darkMode: 'class' in tailwind.config.ts) react to live —
  // exactly like flipping the OS/browser color scheme in the real app.
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
  ],
};

export default preview;
