import { SelectHTMLAttributes, forwardRef } from 'react';

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700
        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20
        outline-none transition-colors appearance-none ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';
export default Select;
