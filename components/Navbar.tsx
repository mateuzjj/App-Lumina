import React from 'react';
import { Home, PlusCircle, PieChart, Target, TrendingUp } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'analytics', icon: PieChart, label: 'Análise' },
    { id: 'add', icon: PlusCircle, label: 'Novo', highlight: true },
    { id: 'planning', icon: Target, label: 'Planos' },
    { id: 'investments', icon: TrendingUp, label: 'Investir' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#030712]/90 backdrop-blur-xl border-t border-white/5 pb-safe pt-2 px-4 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className="relative -top-6 group"
              >
                <div className="absolute inset-0 bg-primary blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className={`relative p-4 rounded-full transition-all duration-300 ${isActive ? 'bg-slate-100 text-primary scale-110' : 'bg-primary text-white border border-white/20'}`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-12 transition-all duration-300 relative ${isActive ? 'text-secondary scale-110' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {isActive && (
                <div className="absolute -top-3 w-8 h-1 bg-secondary rounded-full shadow-[0_0_10px_#06b6d4]"></div>
              )}
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''} />
              <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
