import React from 'react';
import { cn } from '../../utils/formatters';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // 'default' (white) | 'primary' (dark green)
  className = '',
}) {
  const isPrimary = variant === 'primary';

  return (
    <div
      className={cn(
        'rounded-2xl p-5 transition-all duration-150',
        isPrimary
          ? 'bg-[#1E392A] text-white shadow-sm'
          : 'bg-white border border-[#E2DFC9] text-[#18201B] hover:border-[#D1CCA9]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'text-sm font-medium',
            isPrimary ? 'text-emerald-100/80' : 'text-[#637063]'
          )}
        >
          {title}
        </span>
        {Icon && (
          <div
            className={cn(
              'p-1.5 rounded-lg flex items-center justify-center',
              isPrimary ? 'bg-white/10 text-white' : 'text-[#637063]'
            )}
          >
            <Icon size={18} strokeWidth={1.75} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <span className="text-3xl font-bold tracking-tight block">
          {value}
        </span>
      </div>

      {subtitle && (
        <div
          className={cn(
            'mt-3 text-xs',
            isPrimary ? 'text-emerald-200/70' : 'text-[#7D887D]'
          )}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

