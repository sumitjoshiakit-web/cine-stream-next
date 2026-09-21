'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const variantClasses =
    variant === 'primary'
      ? 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500'
      : 'bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 focus-visible:ring-zinc-500';

  const baseClasses =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <button
      type="button"
      disabled={disabled}
      className={baseClasses + ' ' + variantClasses + ' ' + className}
      {...props}
    >
      {children}
    </button>
  );
};
