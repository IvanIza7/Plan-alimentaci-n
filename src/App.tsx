import React, { useState } from 'react';
import { Home, Calendar, ShoppingCart, LineChart, User, WifiOff } from 'lucide-react';
import HomeView from './components/HomeView';
import PlanView from './components/PlanView';
import ProgressView from './components/ProgressView';
import ShoppingView from './components/ShoppingView';
import ProfileView from './components/ProfileView';
import InventoryView from './components/InventoryView';
import EquivalencesView from './components/EquivalencesView';
import { useAuth } from './AuthContext';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { AppDataProvider } from './hooks/useAppData';


const bgPositionMap: Record<string, string> = {
  'inicio': '0%',
  'plan': '25%',
  'inventario': '35%',
  'equivalencias': '35%',
  'compras': '50%',
  'progreso': '75%',
  'perfil': '100%'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const { user, loading, signIn, error } = useAuth();
  const isOnline = useNetworkStatus();
  
  const handleLogin = () => {
    signIn();
  };

  if (error) {
    return <div className="min-h-screen bg-background flex flex-col items-center justify-center font-display text-text-main p-8 text-center">
      <p className="font-black text-2xl uppercase tracking-widest text-red-500 mb-4">Error de Autenticación</p>
      <p className="text-sm font-bold bg-surface p-4 rounded-xl border-2 border-text-main">{error}</p>
    </div>;
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-display font-black text-2xl uppercase tracking-widest text-text-main">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div 
        className="fixed -inset-[50px] md:inset-0 z-[0] pointer-events-none transition-all duration-1000 ease-out"
        style={{ backgroundImage: "url('/fondo.jpg')", backgroundSize: 'cover', backgroundPosition: '50% center' }}
      />
      <div className="relative z-10 w-full flex justify-center">
        <div className="max-w-sm w-full bg-surface border-4 border-text-main p-8 rounded-[32px] neo-card shadow-[8px_8px_0_0_var(--color-text-main)] text-center">
           <div className="w-20 h-20 mx-auto bg-primary-900 text-accent-500 flex items-center justify-center font-display font-black text-4xl neo-card !rounded-full mb-6">
             PN
           </div>
           <h1 className="font-display font-black text-3xl text-text-main tracking-tighter uppercase mb-2">NutriPlan</h1>
           <p className="text-xs font-bold text-text-secondary mb-8 uppercase tracking-widest">Tu plan nutricional neo-brutalista</p>
           <button 
             onClick={signIn}
             className="w-full bg-primary-900 text-surface py-4 rounded-full font-black uppercase tracking-widest neo-btn hover:bg-primary-800 border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] transition-all"
           >
             Ingresar con Google
           </button>
        </div>
      </div>
      </div>
    );
  }

  return (
    <AppDataProvider>
    <div className="flex flex-col min-h-screen bg-background md:pl-[300px] overflow-x-hidden relative">
      <div 
        className="fixed -inset-[50px] md:inset-0 z-[0] pointer-events-none transition-all duration-1000 ease-out"
        style={{ 
          backgroundImage: "url('/fondo.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: `${bgPositionMap[activeTab] || '0%'} center` 
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-[300px] bg-surface border-r-4 border-text-main p-8 z-50">
        <div className="mb-12 flex items-center gap-4">
           <div className="w-14 h-14 bg-primary-900 text-accent-500 flex items-center justify-center font-display font-black text-2xl neo-card !rounded-full">
             PN
           </div>
           <h1 className="font-display font-black text-3xl text-text-main tracking-tighter uppercase mt-1">NutriPlan</h1>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <NavItem icon={<Home size={22} />} label="Inicio" active={activeTab === 'inicio'} onClick={() => setActiveTab('inicio')} />
          <NavItem icon={<Calendar size={22} />} label="Plan" active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} />
          <NavItem icon={<ShoppingCart size={22} />} label="Compras" active={activeTab === 'compras'} onClick={() => setActiveTab('compras')} />
          <NavItem icon={<LineChart size={22} />} label="Progreso" active={activeTab === 'progreso'} onClick={() => setActiveTab('progreso')} />
        </nav>

        <div className="mt-auto">
          <NavItem icon={<User size={22} />} label="Perfil" active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} />
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-5 sm:p-8 lg:p-12 max-w-xl mx-auto w-full min-h-screen pb-32 md:pb-12">
         {!isOnline && (
            <div className="bg-[#fde047] text-text-main p-4 rounded-[20px] mb-6 flex items-center justify-between border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] animate-in slide-in-from-top-4 fade-in">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center border-2 border-text-main">
                     <WifiOff size={18} />
                  </div>
                  <div>
                     <p className="font-black text-sm uppercase tracking-widest">Modo Sin Conexión</p>
                     <p className="text-[10px] font-bold">Tus cambios se sincronizarán al recuperar la señal.</p>
                  </div>
               </div>
            </div>
         )}
         {activeTab === 'inicio' && <HomeView onNavigate={setActiveTab} />}
         {activeTab === 'plan' && <PlanView />}
         {activeTab === 'compras' && <ShoppingView />}
         {activeTab === 'progreso' && <ProgressView />}
         {activeTab === 'perfil' && <ProfileView />}
         {activeTab === 'inventario' && <InventoryView />}
         {activeTab === 'equivalencias' && <EquivalencesView />}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-6 inset-x-4 bg-surface neo-card px-4 py-3 flex justify-between items-center z-50">
        <MobileNavItem icon={<Home size={22} />} label="Inicio" active={activeTab === 'inicio'} onClick={() => setActiveTab('inicio')} />
        <MobileNavItem icon={<Calendar size={22} />} label="Plan" active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} />
        <MobileNavItem icon={<ShoppingCart size={22} />} label="Compras" active={activeTab === 'compras'} onClick={() => setActiveTab('compras')} />
        <MobileNavItem icon={<LineChart size={22} />} label="Progreso" active={activeTab === 'progreso'} onClick={() => setActiveTab('progreso')} />
        <MobileNavItem icon={<User size={22} />} label="Perfil" active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} />
      </nav>
      </div>
    </div>
    </AppDataProvider>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-4 px-6 py-4 transition-all cursor-pointer w-full ${active ? 'bg-accent-500 text-text-main neo-btn shadow-[4px_4px_0_0_var(--color-text-main)]' : 'text-text-secondary hover:text-text-main hover:bg-black/5 rounded-full border-2 border-transparent'}`}>
      <div className={`${active ? 'text-text-main' : ''}`}>
        {icon}
      </div>
      <span className="text-xs font-black uppercase tracking-widest mt-0.5">{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 min-w-[55px] ${active ? 'text-text-main' : 'text-text-secondary hover:text-text-main'}`}>
      <div className={`p-2.5 transition-all ${active ? 'bg-accent-500 neo-btn shadow-[3px_3px_0_0_var(--color-text-main)]' : 'rounded-full border-2 border-transparent'}`}>
         {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
