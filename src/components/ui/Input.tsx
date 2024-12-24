// components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  label,
  error,
  ...props
}, ref) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">{label}</label>
    )}
    <input
      ref={ref}
      className={`
        w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2
        text-sm text-red-500 transition-colors focus:border-blue-500 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        disabled:cursor-not-allowed disabled:opacity-50 
        ${error ? 'border-red-500' : ''} ${className}
      `}
      {...props}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';
