import { InputHTMLAttributes, forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700
        placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20
        outline-none transition-colors disabled:bg-slate-100 disabled:text-slate-400 ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';
export default Input;
