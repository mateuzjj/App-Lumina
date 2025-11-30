import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Settings, ChevronLeft, ChevronRight, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Transaction, FinancialSummary, TransactionType } from '../types';
import { IconMapper } from '../components/IconMapper';
import { CATEGORIES } from '../constants';

interface DashboardProps {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  currentDate: Date;
  onOpenSettings: () => void;
  onMonthChange: (offset: number) => void;
  onToggleStatus: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  summary, 
  recentTransactions, 
  currentDate,
  onOpenSettings,
  onMonthChange,
  onToggleStatus,
  onDeleteTransaction
}) => {
  const [viewMode, setViewMode] = useState<'projected' | 'realized'>('realized');
  const [listFilter, setListFilter] = useState<'all' | 'fixed' | 'variable'>('all');
  
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  const displayData = viewMode === 'realized' ? summary.realized : summary.projected;

  const filteredTransactions = recentTransactions.filter(tx => {
    if (listFilter === 'all') return true;
    if (listFilter === 'fixed') return tx.type === TransactionType.EXPENSE_FIXED;
    if (listFilter === 'variable') return tx.type === TransactionType.EXPENSE_VARIABLE;
    return true;
  });

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Lumina <span className="text-secondary">OS</span></h1>
        </div>
        <button 
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between bg-surface/50 border border-white/5 rounded-2xl p-2 backdrop-blur-md">
        <button onClick={() => onMonthChange(-1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-bold uppercase tracking-widest text-secondary drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
            {monthName}
        </span>
        <button onClick={() => onMonthChange(1)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <ChevronRight size={20} />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-surface border border-primary/30 p-6 shadow-neon-primary transition-all duration-500">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-secondary/10 rounded-full blur-[40px]"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 text-primaryGlow">
                <div className="p-1.5 rounded bg-primary/20">
                <Wallet size={14} />
                </div>
                <span className="text-xs font-bold tracking-wider uppercase font-mono">
                    {viewMode === 'realized' ? 'Saldo Realizado (Caixa)' : 'Saldo Previsto (Competência)'}
                </span>
            </div>
            <button 
                onClick={() => setViewMode(prev => prev === 'realized' ? 'projected' : 'realized')}
                className="text-[10px] font-bold uppercase tracking-wider bg-black/40 px-2 py-1 rounded border border-white/10 hover:border-primary/50 transition-colors"
            >
                Mudar p/ {viewMode === 'realized' ? 'Previsto' : 'Realizado'}
            </button>
          </div>
          
          <h2 className={`text-4xl font-bold tracking-tighter font-mono shadow-black drop-shadow-lg transition-all duration-300 ${displayData.balance < 0 ? 'text-danger' : 'text-white'}`}>
            {formatMoney(displayData.balance)}
          </h2>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-black/40 rounded-xl p-3 backdrop-blur-md border border-white/5">
              <div className="flex items-center gap-1 text-success text-[10px] uppercase font-bold mb-1">
                <ArrowUpRight size={10} />
                <span>Entradas</span>
              </div>
              <p className="text-base font-semibold text-slate-100 font-mono">{formatMoney(displayData.income)}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-3 backdrop-blur-md border border-white/5">
              <div className="flex items-center gap-1 text-danger text-[10px] uppercase font-bold mb-1">
                <ArrowDownRight size={10} />
                <span>Saídas</span>
              </div>
              <p className="text-base font-semibold text-slate-100 font-mono">
                {formatMoney(displayData.expenses)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Extrato</h3>
          <div className="flex gap-2">
            <button 
                onClick={() => setListFilter('all')}
                className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border transition-all ${listFilter === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-white/10'}`}
            >
                Todos
            </button>
            <button 
                onClick={() => setListFilter('fixed')}
                className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border transition-all ${listFilter === 'fixed' ? 'bg-primary/20 text-primary border-primary' : 'bg-transparent text-slate-500 border-white/10'}`}
            >
                Fixos
            </button>
            <button 
                onClick={() => setListFilter('variable')}
                className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border transition-all ${listFilter === 'variable' ? 'bg-secondary/20 text-secondary border-secondary' : 'bg-transparent text-slate-500 border-white/10'}`}
            >
                Var.
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-surface/30 rounded-2xl border border-white/5 border-dashed">
              <p className="text-sm font-mono">VAZIO</p>
              <p className="text-xs mt-1 text-slate-600">
                {listFilter === 'all' ? 'Nenhum registro neste mês.' : `Nenhuma despesa ${listFilter === 'fixed' ? 'fixa' : 'variável'} encontrada.`}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const cat = CATEGORIES.find(c => c.id === tx.category);
              const isIncome = tx.type === TransactionType.INCOME;
              const isPaid = tx.status === 'paid';
              const displayTitle = tx.note || cat?.name.split('/')[0];
              const displaySubtitle = tx.note ? cat?.name.split('/')[0] : null;
              
              return (
                <div key={tx.id} className={`group flex items-center gap-3 bg-surface p-3 rounded-2xl border transition-all duration-300 ${isPaid ? 'border-success/20 bg-success/5' : 'border-white/5 hover:border-white/20'}`}>
                  
                  <button 
                    onClick={() => onToggleStatus(tx.id)}
                    className={`flex-shrink-0 transition-all ${isPaid ? 'text-success scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    {isPaid ? <CheckCircle2 size={24} className="drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]" /> : <Circle size={24} />}
                  </button>

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${cat?.color || 'border-slate-700'}`}>
                    <IconMapper iconName={cat?.icon || 'HelpCircle'} className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                        <h4 className={`font-medium text-sm truncate ${isPaid ? 'text-slate-300' : 'text-white'}`}>{displayTitle}</h4>
                        {displaySubtitle && (
                            <span className="text-[10px] text-slate-500 truncate">{displaySubtitle}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                         <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono uppercase">
                             <span>{new Date(tx.date).toLocaleDateString('pt-BR', {day: '2-digit'})}</span>
                             <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                             <span>{tx.paymentMethod === 'credit_card' ? 'Crédito' : tx.paymentMethod === 'debit_card' ? 'Débito' : tx.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'}</span>
                         </div>
                    </div>
                  </div>

                  <div className={`font-bold font-mono text-sm whitespace-nowrap ${isIncome ? 'text-success' : 'text-slate-200'} ${isPaid ? 'opacity-100' : 'opacity-70'}`}>
                    {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                  </div>

                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTransaction(tx.id);
                    }}
                    className="p-2 -mr-2 text-slate-600 hover:text-danger hover:bg-danger/10 rounded-xl transition-all opacity-40 hover:opacity-100 focus:opacity-100"
                    title="Excluir Transação"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};