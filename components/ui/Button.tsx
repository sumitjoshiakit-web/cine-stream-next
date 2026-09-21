import React from 'react';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Size of the button. */
  size?: ButtonSize;
  /** Disables the button and applies a muted "disabled" visual state. */
  disabled?: boolean;
  /** Button label / content. */
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-sm shadow-red-900/30 dark:shadow-red-950/50 focus-visible:ring-red-500',
  secondary:
    'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 active:bg-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 focus-visible:ring-zinc-500',
};

/**
 * Core Button component of the Cine-Stream design system.
 *
 * Supports two visual variants (Primary / Secondary) and a Disabled state,
 * all of which are exposed as Storybook Args so they can be toggled live
 * from the Controls panel. Fully theme-aware via Tailwind's `dark:` variant.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
        'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'dark:focus-visible:ring-offset-zinc-950',
        sizeClasses[size],
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none grayscale' : 'cursor-pointer',
        variantClasses[variant],
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
};
