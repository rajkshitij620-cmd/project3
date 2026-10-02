import React from 'react';

const statusVariants = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  completed: 'bg-blue-50 text-blue-800 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  brand: 'bg-amber-100/70 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
  dark: 'bg-slate-900 text-slate-100 border-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-200',
};

export const Badge = ({
  children,
  variant = 'neutral',
  status,
  size = 'sm',
  className = '',
}) => {
  const chosenVariant = status ? statusVariants[status] || statusVariants.neutral : statusVariants[variant] || statusVariants.neutral;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full tracking-tight ${chosenVariant} ${sizeClasses} ${className}`}
    >
      {status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
      {status === 'confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {status === 'completed' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
      {status === 'cancelled' && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
      {children}
    </span>
  );
};

export default Badge;
