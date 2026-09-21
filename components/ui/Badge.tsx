import React from 'react';
import { Star } from 'lucide-react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'disabled';

export interface BadgeProps {
  /** Visual style of the badge. */
  variant?: BadgeVariant;
  /** Text content of the badge. */
  label: string;
  /** Show the small star icon (used for rating-style badges like on MovieCard). */
  withIcon?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-red-600 text-white border-red-500 dark:bg-red-600 dark:border-red-500',
  secondary:
    'bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
  success:
    'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-800/60',
  disabled: 'bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800',
};

/**
 * Small pill-shaped Badge used across the app (genre tags, rating chips).
 * Demonstrates the same variant/disabled pattern as Button, styled for both
 * light and dark themes.
 */
export const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', label, withIcon = false }) => {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
      ].join(' ')}
    >
      {withIcon && <Star className="w-3 h-3 fill-current" />}
      {label}
    </span>
  );
};
