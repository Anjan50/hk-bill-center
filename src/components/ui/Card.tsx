'use client';
// components/ui/Card.tsx

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-white shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';