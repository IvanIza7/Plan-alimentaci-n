import React from 'react';
import { UserCircle, Target, BellRing, Settings, Lock, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';

export default function ProfileView() {
  const { resetData } = useAppData();

  return (
    <div className="flex flex-col gap-6 pb-20 items-center">
      <header className="pt-8 flex flex-col items-center w-full">
         <div className="w-24 h-24 bg-primary-900 text-surface rounded-full flex items-center justify-center text-4xl font-display font-black neo-card shadow-[4px_4px_0_0_var(--color-text-main)] mb-5">
            I
         </div>
         <h1 className="text-3xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight">Iván</h1>
         <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mt-1">Plan activo - Menú semanal</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 w-full mt-2">
         <div className="bg-surface border-2 border-text-main rounded-[24px] p-5 flex flex-col items-center neo-card shadow-[4px_4px_0_0_var(--color-text-main)]">
            <span className="font-display font-black text-2xl text-text-main">28</span>
            <span className="text-[9px] font-black uppercase text-text-secondary tracking-widest mt-1.5">Edad</span>
            <span className="text-[9px] text-text-secondary">años</span>
         </div>
         <div className="bg-surface border-2 border-text-main rounded-[24px] p-5 flex flex-col items-center neo-card shadow-[4px_4px_0_0_var(--color-text-main)]">
            <span className="font-display font-black text-2xl text-text-main">175</span>
            <span className="text-[9px] font-black uppercase text-text-secondary tracking-widest mt-1.5">Altura</span>
            <span className="text-[9px] text-text-secondary">cm</span>
         </div>
         <div className="bg-surface border-2 border-text-main rounded-[24px] p-5 flex flex-col items-center neo-card shadow-[4px_4px_0_0_var(--color-text-main)]">
            <span className="font-display font-black text-2xl text-text-main">68</span>
            <span className="text-[9px] font-black uppercase text-text-secondary tracking-widest mt-1.5">Peso</span>
            <span className="text-[9px] text-text-secondary">kg</span>
         </div>
      </div>

      {/* Settings List */}
      <div className="w-full space-y-4 mt-4">
         <ProfileOption icon={<UserCircle className="text-primary-900" size={24} />} title="Información personal" subtitle="Nombre, sexo, edad" />
         <ProfileOption icon={<Target className="text-pink-600" size={24} />} title="Objetivos" subtitle="Metas y rangos deseables" />
         <ProfileOption icon={<BellRing className="text-yellow-600" size={24} />} title="Notificaciones" subtitle="Recordatorios de comida" />
         <ProfileOption icon={<Settings className="text-slate-500" size={24} />} title="Configuración" subtitle="Comidas, unidades, plan" />
         <ProfileOption icon={<Lock className="text-orange-500" size={24} />} title="Privacidad" subtitle="Datos y exportación" />
      </div>

      {/* Danger Zone */}
      <div className="w-full mt-8">
        <button 
          onClick={() => {
            if (window.confirm('¿Estás seguro de que deseas borrar los menús actuales y cargar los 7 menús base?')) {
              resetData();
            }
          }}
          className="w-full bg-red-500 text-white border-2 border-text-main rounded-2xl p-4 flex items-center justify-center gap-3 neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-1 transition-all"
        >
          <AlertTriangle size={24} />
          <span className="font-display font-black tracking-widest uppercase text-sm">Restaurar Datos Iniciales</span>
        </button>
        <p className="text-xs text-text-secondary text-center mt-3 font-bold uppercase tracking-wider">
          Esto borrará tus menús modificados y cargará los de fábrica.
        </p>
      </div>
    </div>
  );
}

function ProfileOption({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
   return (
      <button className="w-full bg-surface border-2 border-text-main rounded-[24px] p-5 flex items-center gap-4 neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1 transition-all cursor-pointer">
         <div className="shrink-0">{icon}</div>
         <div className="flex-1 text-left">
            <h3 className="font-bold text-sm text-text-main">{title}</h3>
            <p className="text-[10px] font-medium text-text-secondary mt-0.5">{subtitle}</p>
         </div>
         <ChevronRight size={20} className="text-text-secondary shrink-0" />
      </button>
   )
}
