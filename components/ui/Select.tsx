import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        className={`
          w-full rounded-xl border bg-white px-4 py-2.5 text-sm
          border-gray-200
          focus:border-primary focus:ring-2 focus:ring-primary/20
          outline-none transition-all
          ${error ? 'border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}