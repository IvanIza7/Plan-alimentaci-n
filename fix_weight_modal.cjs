const fs = require('fs');
const path = './src/components/ProgressView.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldModal = `<div className="space-y-4">
                     <div>
                        <label className="block text-\\[10px\\] font-black uppercase tracking-widest text-text-secondary mb-1">Peso \\(kg\\)</label>
                        <input type="number" step="0.1" value=\\{newWeight\\} onChange=\\{e => setNewWeight\\(e.target.value\\)\\} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-text-main focus:outline-none focus:border-primary-500 shadow-\\[2px_2px_0_0_var\\(--color-text-main\\)\\]" placeholder="Ej: 68.5" />
                     </div>
                     <div>
                        <label className="block text-\\[10px\\] font-black uppercase tracking-widest text-text-secondary mb-1">Grasa \\(%\\) - Opcional</label>
                        <input type="number" step="0.1" value=\\{newFat\\} onChange=\\{e => setNewFat\\(e.target.value\\)\\} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-text-main focus:outline-none focus:border-primary-500 shadow-\\[2px_2px_0_0_var\\(--color-text-main\\)\\]" placeholder="Ej: 18.5" />
                     </div>
                     <button onClick=\\{\\(\\) => \\{
                        // Aquí iría la lógica de guardado
                        setShowWeightModal\\(false\\);
                        setNewWeight\\(''\\);
                        setNewFat\\(''\\);
                     \\}\\} className="w-full bg-accent-500 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-3 rounded-full neo-btn hover:bg-accent-400 mt-4 shadow-\\[4px_4px_0_0_var\\(--color-text-main\\)\\]">
                        Guardar Registro
                     </button>
                  </div>`;

const newModal = `<div className="space-y-6">
                     <div className="flex flex-col items-center justify-center space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary">Peso (kg)</label>
                        <div className="flex flex-col items-center gap-2">
                           <input type="range" min="30" max="150" step="0.1" value={newWeight || 65} onChange={e => setNewWeight(e.target.value)} className="w-full max-w-[200px] accent-primary-500" />
                           <input type="number" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)} className="w-32 bg-background border-2 border-text-main rounded-xl p-3 text-3xl font-display font-black text-text-main text-center focus:outline-none focus:border-primary-500 shadow-[2px_2px_0_0_var(--color-text-main)]" placeholder="65.0" />
                        </div>
                     </div>
                     <button onClick={() => {
                        setShowWeightModal(false);
                        setNewWeight('');
                     }} className="w-full bg-accent-500 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-full neo-btn hover:bg-accent-400 mt-4 shadow-[4px_4px_0_0_var(--color-text-main)]">
                        Guardar Registro
                     </button>
                  </div>`;

content = content.replace(new RegExp(oldModal), newModal);
fs.writeFileSync(path, content, 'utf8');
