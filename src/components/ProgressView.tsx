import React, { useState } from 'react';
import { TrendingDown, ChevronDown, Plus, X, Calendar, Activity, XCircle, PlusCircle } from 'lucide-react';
import { useAllConsumptionLogs } from '../hooks/useConsumption';
import { TrackedItem } from './ConsumptionTracker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weightHistory = {
   "2026": {
      "Agosto": [
         { timestamp: 1725062400000, date: "31 AGO", time: "07:30 AM", weight: 68.0, fat: "18.2%" },
         { timestamp: 1723680000000, date: "15 AGO", time: "08:15 AM", weight: 68.8, fat: "18.9%" }
      ],
      "Julio": [
         { timestamp: 1721433600000, date: "20 JUL", time: "06:45 AM", weight: 69.5, fat: "19.5%" }
      ]
   },
   "2025": {
      "Diciembre": [
         { timestamp: 1702598400000, date: "15 DIC", time: "09:00 AM", weight: 70.2, fat: "20.1%" }
      ]
   }
};

const flatChartData = [
  { date: "15 Dic", weight: 70.2 },
  { date: "20 Jul", weight: 69.5 },
  { date: "15 Ago", weight: 68.8 },
  { date: "31 Ago", weight: 68.0 },
];

export default function ProgressView() {
  const [tab, setTab] = useState<'adherencia' | 'composicion'>('composicion');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newFat, setNewFat] = useState('');
  const [expandedHistory, setExpandedHistory] = useState<string[]>(['2026', '2026-Agosto']);
  const [showChart, setShowChart] = useState(false);

  const allHistoryKeys = Object.entries(weightHistory).flatMap(([year, months]) => [
     year,
     ...Object.keys(months).map(month => `${year}-${month}`)
  ]);

  const toggleExpandAll = () => {
     if (expandedHistory.length === allHistoryKeys.length) {
        setExpandedHistory([]);
     } else {
        setExpandedHistory(allHistoryKeys);
     }
  };

  const toggleHistoryNode = (key: string) => {
     setExpandedHistory(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const { logs } = useAllConsumptionLogs();
  
  let adherenceScore = 0;
  let totalSubstitutions = 0;
  let totalSkipped = 0;
  let totalAdded = 0;
  let totalMeals = logs.length;

  if (totalMeals > 0) {
    adherenceScore = Math.round(logs.reduce((acc, log) => acc + log.adherenceScore, 0) / totalMeals);
    
    logs.forEach(log => {
      try {
        const items: TrackedItem[] = JSON.parse(log.items);
        totalSubstitutions += items.filter(i => i.status === 'substituted').length;
        totalSkipped += items.filter(i => i.status === 'skipped').length;
        totalAdded += items.filter(i => i.status === 'added').length;
      } catch (e) {}
    });
  }

  return (
     <div className="flex flex-col gap-8 pb-10">
        <header className="pt-2 flex justify-between items-center">
           <div>
              <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1">Semana Actual</p>
              <h1 className="text-3xl md:text-4xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight uppercase">Tu Progreso</h1>
           </div>
        </header>

        {/* Segmented Control */}
        <div className="bg-background rounded-full p-1.5 flex border-2 border-border-subtle neo-card shadow-none">
           <button 
              onClick={() => setTab('adherencia')}
              className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${tab === 'adherencia' ? 'bg-accent-500 text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'text-text-secondary hover:text-text-main'}`}
           >
              Adherencia
           </button>
           <button 
              onClick={() => setTab('composicion')}
              className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${tab === 'composicion' ? 'bg-accent-500 text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'text-text-secondary hover:text-text-main'}`}
           >
              Composición
           </button>
        </div>

        {tab === 'adherencia' ? (
           <>
           {/* Main Stats Card */}
           <div className="bg-primary-900 rounded-[32px] p-8 text-surface border-2 border-primary-900 flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-300 mb-2">Nivel de Adherencia</p>
              <div className="flex items-baseline gap-2 mb-2">
                 <h2 className="text-6xl md:text-7xl font-display font-black text-surface tracking-tighter">{totalMeals > 0 ? adherenceScore : '--'}</h2>
                 <span className="text-2xl font-bold text-primary-300">%</span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary-300">{adherenceScore >= 80 ? '¡Vas por muy buen camino!' : 'Sigue esforzándote, ¡tú puedes!'}</p>
              
              <div className="flex gap-2 mt-6">
                 {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <div key={day} className={`flex-1 aspect-square rounded-full flex items-center justify-center border-2 border-text-main ${i < 5 ? 'bg-accent-500 text-text-main' : 'bg-surface text-text-main'}`}>
                       <span className={`text-[10px] font-black uppercase tracking-widest`}>{day}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Adherence Details Grid */}
           <div className="mt-4">
              <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4 px-2">Patrones de Conducta</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-surface border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] p-5 rounded-[28px]">
                    <div className="w-10 h-10 rounded-full bg-accent-500 border-2 border-text-main flex items-center justify-center mb-3 text-text-main">
                       <Activity size={20} />
                    </div>
                    <h3 className="text-3xl font-display font-black text-text-main mb-1 tracking-tight">{totalMeals}</h3>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Comidas<br/>Registradas</p>
                 </div>
                 <div className="bg-surface border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] p-5 rounded-[28px]">
                    <div className="w-10 h-10 rounded-full bg-accent-500 border-2 border-text-main flex items-center justify-center mb-3 text-text-main">
                       <TrendingDown size={20} />
                    </div>
                    <h3 className="text-3xl font-display font-black text-text-main mb-1 tracking-tight">{totalSubstitutions}</h3>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Alimentos<br/>Sustituidos</p>
                 </div>
                 <div className="bg-surface border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] p-5 rounded-[28px]">
                    <div className="w-10 h-10 rounded-full bg-accent-500 border-2 border-text-main flex items-center justify-center mb-3 text-text-main">
                       <XCircle size={20} />
                    </div>
                    <h3 className="text-3xl font-display font-black text-text-main mb-1 tracking-tight">{totalSkipped}</h3>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Alimentos<br/>Omitidos</p>
                 </div>
                 <div className="bg-surface border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] p-5 rounded-[28px]">
                    <div className="w-10 h-10 rounded-full bg-accent-500 border-2 border-text-main flex items-center justify-center mb-3 text-text-main">
                       <PlusCircle size={20} />
                    </div>
                    <h3 className="text-3xl font-display font-black text-text-main mb-1 tracking-tight">{totalAdded}</h3>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Alimentos<br/>Extra</p>
                 </div>
              </div>
           </div>
           </>
        ) : (
           <>
           {/* Main Composition Card (Hero) */}
           <button 
              onClick={() => setShowChart(!showChart)}
              className="text-left bg-accent-500 rounded-[32px] p-8 text-text-main shadow-[8px_8px_0_0_var(--color-text-main)] border-2 border-text-main flex flex-col hover:bg-accent-400 transition-colors w-full cursor-pointer neo-card"
           >
              <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Peso Actual</p>
                  <ChevronDown size={24} className={`transition-transform text-text-main ${showChart ? 'rotate-180' : ''}`} />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                 <h2 className="text-6xl md:text-7xl font-display font-black text-text-main tracking-tighter">68</h2>
                 <span className="text-2xl font-bold text-text-main">kg</span>
                 <div className="flex items-center gap-1 text-text-main bg-white border-2 border-text-main ml-3 font-bold text-[11px] px-2.5 py-1.5 rounded-full uppercase tracking-wider">
                    <TrendingDown size={14} /> 0.8 kg
                 </div>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-main">vs medición anterior</p>
           </button>

           {/* Weight Chart (Conditionally shown under the hero) */}
           {showChart && (
              <div className="bg-surface border-2 border-border-subtle p-6 rounded-[32px] mt-2 animate-in slide-in-from-top-4 fade-in">
                 <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-6">Gráfica de Peso</h3>
                 <div className="h-48 w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={flatChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} padding={{ left: 20, right: 20 }} />
                          <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
                          <Tooltip 
                             contentStyle={{ borderRadius: '16px', border: '2px solid #0f172a', boxShadow: '4px 4px 0 0 #0f172a', fontWeight: 'bold' }} 
                             labelStyle={{ fontWeight: '900', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}
                          />
                          <Line type="monotone" dataKey="weight" stroke="#0f172a" strokeWidth={4} dot={{ r: 6, strokeWidth: 3, fill: '#fff' }} activeDot={{ r: 8, strokeWidth: 3, fill: '#F59E0B' }} />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           )}

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-4 mt-2">
              <CompCard label="ALTURA" value="1.75 m" range="Rango: Estándar" />
              <CompCard label="PESO" value="68.0 kg" range="Rango: Objetivo 65kg" />
              <CompCard label="BMI" value="22.2" range="Rango: 18.5-24.9" />
              <CompCard label="% DE GRASA" value="18.2%" range="Rango: 8-20%" />
              <CompCard label="GAMA DESEABLE % GRASA" value="12-20%" range="Objetivo Saludable" full />
              <CompCard label="MASA GRASA" value="12.4 kg" range="Rango: 4.7-13.6 kg" />
              <CompCard label="MASA LIBRE DE GRASA" value="55.6 kg" range="Rango: Referencia" />
              <CompCard label="AGUA TOTAL" value="58.1%" range="Rango: 50-65%" />
              <CompCard label="IMPEDANCIA" value="520 Ω" range="Rango: Normal" />
              <CompCard label="BMR" value="1680" range="kcal/día" full />
           </div>

           {/* History Log */}
           <div className="mt-6">
              <div className="flex justify-between items-end mb-4 px-2">
                 <div>
                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-0.5">Bitácora</h3>
                    <p className="text-xs font-bold text-text-main">Historial de Registros</p>
                 </div>
                 <button onClick={toggleExpandAll} className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-600 transition-colors bg-primary-50 px-3 py-1.5 rounded-full">
                    {expandedHistory.length === allHistoryKeys.length ? 'Colapsar Todo' : 'Expandir Todo'}
                 </button>
              </div>

              <div className="space-y-4">
                 {Object.entries(weightHistory).sort(([a], [b]) => Number(b) - Number(a)).map(([year, months]) => {
                    const isYearExpanded = expandedHistory.includes(year);
                    return (
                       <div key={year} className="bg-surface border-2 border-text-main rounded-[24px] overflow-hidden neo-card shadow-[4px_4px_0_0_var(--color-text-main)] transition-all">
                          <button onClick={() => toggleHistoryNode(year)} className="w-full flex justify-between items-center p-4 bg-accent-500 hover:bg-accent-400 transition-colors">
                             <h4 className="text-sm font-black text-text-main uppercase tracking-widest">{year}</h4>
                             <div className={`transition-transform text-text-main ${isYearExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown size={18} />
                             </div>
                          </button>
                          
                          {isYearExpanded && (
                             <div className="border-t-2 border-text-main overflow-hidden transition-all duration-300 ease-in-out">
                                {Object.entries(months).map(([month, entries]) => {
                                   const monthKey = `${year}-${month}`;
                                   const isMonthExpanded = expandedHistory.includes(monthKey);
                                   return (
                                      <div key={monthKey} className="border-b-2 border-border-subtle last:border-b-0">
                                         <button onClick={() => toggleHistoryNode(monthKey)} className="w-full flex justify-between items-center p-4 pl-6 bg-surface hover:bg-slate-50 transition-colors">
                                            <h5 className="text-[11px] font-black text-text-secondary uppercase tracking-widest">{month}</h5>
                                            <div className={`transition-transform text-text-secondary ${isMonthExpanded ? 'rotate-180' : ''}`}>
                                               <ChevronDown size={16} />
                                            </div>
                                         </button>
                                         
                                         {isMonthExpanded && (
                                            <div className="p-4 pl-8 pt-0 space-y-3 bg-surface">
                                               {entries.sort((a, b) => b.timestamp - a.timestamp).map((entry, idx) => (
                                                  <div key={idx} className="bg-accent-500 border-2 border-text-main p-4 rounded-[20px] flex items-center justify-between shadow-[2px_2px_0_0_var(--color-text-main)] transition-colors hover:shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1">
                                                     <div className="flex items-center gap-4">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-text-main border border-text-main shadow-sm"></div>
                                                        <div>
                                                           <div className="flex items-center gap-2 mb-0.5"><p className="text-[9px] font-black uppercase text-text-main tracking-widest">{entry.date}</p><span className="text-[8px] font-bold text-text-main bg-surface px-1.5 py-0.5 rounded-full border border-text-main">{entry.time}</span></div>
                                                           <p className="font-display font-black text-xl text-text-main leading-none">{entry.weight} kg</p>
                                                        </div>
                                                     </div>
                                                     <span className="text-xs font-bold text-text-main">{entry.fat} grasa</span>
                                                  </div>
                                               ))}
                                            </div>
                                         )}
                                      </div>
                                   );
                                })}
                             </div>
                          )}
                       </div>
                    );
                 })}
              </div>
           </div>

           {/* Add Weight Modal */}
         {showWeightModal && (
            <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
               <div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-sm neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)]">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-display font-black text-text-main uppercase tracking-tight">Nuevo Registro</h3>
                     <button onClick={() => setShowWeightModal(false)} className="w-10 h-10 bg-[#ef4444] border-2 border-text-main rounded-full flex items-center justify-center text-white shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-0.5 transition-all neo-btn">
                        <X size={20} strokeWidth={3} />
                     </button>
                  </div>

                  <div className="space-y-6">
                     <div className="flex flex-col items-center justify-center space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary">Peso (kg)</label>
                        <div className="flex items-center gap-6">
                           <input type="range" min="30" max="150" step="0.1" value={newWeight || 65} onChange={e => setNewWeight(e.target.value)} className="h-40 w-8 accent-primary-500 cursor-grab active:cursor-grabbing" style={{ WebkitAppearance: "slider-vertical", writingMode: "vertical-lr" } as any} />
                           <input type="number" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)} className="w-32 bg-background border-2 border-text-main rounded-xl p-3 text-3xl font-display font-black text-text-main text-center focus:outline-none focus:border-primary-500 shadow-[2px_2px_0_0_var(--color-text-main)]" placeholder="65.0" />
                        </div>
                     </div>

                     <button onClick={() => {
                        setShowWeightModal(false);
                        setNewWeight('');
                     }} className="w-full bg-accent-500 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-full neo-btn hover:bg-accent-400 mt-4 shadow-[4px_4px_0_0_var(--color-text-main)]">
                        Guardar Registro
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* FAB */}
         {tab === 'composicion' && (
            <div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-[60]">
               <button onClick={() => setShowWeightModal(true)} className="pointer-events-auto bg-accent-500 text-text-main w-14 h-14 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-accent-400 transition-all hover:-translate-y-1 z-50">
                   <Plus size={24} />
               </button>
            </div>
         )}
           </>
        )}
     </div>
  );
}

function StatCard({ value, label, sub }: { value: string, label: string, sub: string }) {
  return (
     <div className="bg-surface border-2 border-border-subtle p-5 rounded-[28px] cursor-default">
        <h3 className="text-4xl font-display font-black text-primary-900 mb-2 tracking-tight">{value}</h3>
        <p className="text-xs font-black text-text-main leading-tight uppercase tracking-wider">{label}</p>
        <p className="text-[9px] font-bold text-text-secondary mt-1.5 uppercase tracking-widest">{sub}</p>
     </div>
  )
}

function CompCard({ label, value, range, full }: { label: string, value: string, range: string, full?: boolean }) {
  return (
     <div className={`bg-surface border-2 border-border-subtle p-5 rounded-[24px] ${full ? 'col-span-2 sm:col-span-1' : ''}`}>
        <p className="text-[9px] font-black text-primary-700 uppercase tracking-widest mb-1.5">{label}</p>
        <h3 className="text-2xl font-display font-black text-text-main mb-1.5 tracking-tight">{value}</h3>
        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">{range}</p>
     </div>
  )
}
