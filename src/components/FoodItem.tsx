import React from 'react';
import { StatusBadge } from './StatusBadge';

export default function FoodItem({ icon, name, qty, status, statusText, action, onClick }: any) {
    return (
        <div onClick={onClick} className={`bg-surface border-2 border-text-main p-4 rounded-[24px] flex items-center gap-4 transition-all ${onClick ? 'cursor-pointer hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] neo-card' : 'neo-card shadow-[4px_4px_0_0_var(--color-text-main)]'}`}>
            <div className="w-12 h-12 bg-background rounded-[16px] border-2 border-text-main flex items-center justify-center text-2xl shrink-0 shadow-[2px_2px_0_0_var(--color-text-main)]">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-text-main truncate">{name}</p>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-0.5">{qty}</p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
                <StatusBadge status={status} text={statusText} />
                {action}
            </div>
        </div>
    )
}
