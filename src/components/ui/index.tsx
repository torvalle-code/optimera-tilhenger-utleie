'use client';

import React from 'react';

// ========================
// BUTTON
// ========================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'terminal';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#E52629] text-white hover:bg-[#C41E21] focus:ring-[#E52629]/50',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400/50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400/50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    terminal: 'px-8 py-4 text-lg min-h-[56px] w-full',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ========================
// INPUT
// ========================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  unit?: string;
  inputSize?: 'md' | 'terminal';
}

export function Input({
  label,
  error,
  helpText,
  unit,
  inputSize = 'md',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const sizeClasses = {
    md: 'h-10 px-3 text-base',
    terminal: 'h-14 px-4 text-lg',
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full border rounded-lg bg-white ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#E52629]'
          } focus:outline-none focus:ring-2 focus:ring-offset-0 ${sizeClasses[inputSize]} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
}

// ========================
// SELECT
// ========================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  selectSize?: 'md' | 'terminal';
}

export function Select({
  label,
  options,
  error,
  selectSize = 'md',
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const sizeClasses = {
    md: 'h-10 px-3 text-base',
    terminal: 'h-14 px-4 text-lg',
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full border rounded-lg bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-[#E52629] ${sizeClasses[selectSize]} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ========================
// CARD
// ========================

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ title, children, className = '', onClick }: CardProps) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
        onClick ? 'cursor-pointer hover:border-gray-300 hover:shadow-md transition-all text-left w-full' : ''
      } ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </Wrapper>
  );
}

// ========================
// BADGE
// ========================

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color = 'bg-gray-100 text-gray-800', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {children}
    </span>
  );
}

// ========================
// STATUS DOT
// ========================

interface StatusDotProps {
  status: 'online' | 'syncing' | 'offline';
  label?: string;
}

export function StatusDot({ status, label }: StatusDotProps) {
  const colors = {
    online: 'bg-green-500',
    syncing: 'bg-amber-500 animate-pulse',
    offline: 'bg-red-500',
  };

  const labels = {
    online: 'Tilkoblet',
    syncing: 'Synkroniserer',
    offline: 'Frakoblet',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${colors[status]}`} />
      {label !== undefined ? (
        <span className="text-xs text-gray-600">{label}</span>
      ) : (
        <span className="text-xs text-gray-600">{labels[status]}</span>
      )}
    </div>
  );
}

// ========================
// TOGGLE
// ========================

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ label, checked, onChange, disabled }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            checked ? 'bg-[#E52629]' : 'bg-gray-300'
          } ${disabled ? 'opacity-50' : ''}`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}
