import React from 'react';

export function StatusBadge({ status, text }: { status: string, text: string }) {
  const colors: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    partial: 'bg-yellow-100 text-yellow-700',
    missing: 'bg-red-100 text-red-700'
  };
  const dots: Record<string, string> = {
    available: 'bg-green-500',
    partial: 'bg-yellow-500',
    missing: 'bg-red-500'
  };
  return (
    <div className={`px-2.5 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap ${colors[status]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dots[status]}`}></div>
      {text}
    </div>
  );
}
