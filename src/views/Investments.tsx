import React, { useState, useMemo } from 'react';
import { Investment } from '../types';
import { TrendingUp, Plus, Trash2, DollarSign, Calculator } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface InvestmentsProps {
  investments: Investment[];
  onAddInvestment: (inv: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

export const Investments: React.FC<InvestmentsProps> = ({ investments, onAddInvestment, onDeleteInvestment }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newInv, setNewInv] = useState({ name: '', amount: '', rate: '10' });

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const handleAdd = () => {
    if (newInv.name && newInv.amount) {
      onAddInvestment({
        id: Math.random().toString(36).substr(2, 9),
        name: newInv.name,
        monthlyContribution: parseFloat(newInv.amount),
        annualRate: parseFloat(newInv.rate),
        startDate: new Date().toISOString()
      });
      setIsAdding(false);
      setNewInv({ name: '', amount: '', rate: '10' });
    }
  };

  const projectionData = useMemo(() => {
    if (investments.length === 0) return [];

    const data = [];
    for (let month = 0; month <= 60; month++) {
      let totalAmount = 0;
      let totalInvested = 0;

      investments.forEach(inv => {
        const monthlyRate = Math.pow(1 + (inv.annualRate / 100), 1/12) - 1;
        const amount = inv.monthlyContribution * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate);
        const invested = inv.monthlyContribution * month;
        
        totalAmount += amount;
        totalInvested += invested;
      });

      if (month % 3 === 0) { 
        data.push({
            month,
            total: totalAmount,
            invested: totalInvested,
            yield: totalAmount - totalInvested,
            label: `${Math.floor(month / 12)}a ${month % 12}m`
        });
      }
    }
    return data;
  }, [investments]);

  const totalMonthlyContribution = investments.reduce((acc, curr) => acc + curr.monthlyContribution, 0);
  
  const calculateProjection = (years: number) => {
    let total = 0;
    investments.forEach(inv => {
        const months = years * 12;
        const monthlyRate = Math.pow(1 + (inv.annualRate / 100), 1/12) - 1;
        if (monthlyRate === 0) {
            total += inv.monthlyContribution * months;
        } else {
            total += inv.monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }
    });
    return total;
  };

  if (isAdding) {
    return (
      <div className="pb-24 pt-4 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setIsAdding(false)} className="text-slate-400">Cancelar</button>
          <h2 className="text-lg font-semibold text-white">Novo Investimento</h2>
          <button onClick={handleAdd} className="text-primary font-semibold">Salvar</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Nome do Ativo</label>
            <input 
              className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition-colors"
              placeholder="Ex: Tesouro Selic, FIIs, Bitcoin..."
              value={newInv.name}
              onChange={(e) => setNewInv({...newInv, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Aporte Mensal</label>
            <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">R$</span>
                <input 
                    type="number"
                    className="w-full bg-surface border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-primary transition-colors"
                    placeholder="0,00"
                    value={newInv.amount}
                    onChange={(e) => setNewInv({...newInv, amount: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Rentabilidade Anual Estimada (%)</label>
            <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">%</span>
                <input 
                    type="number"
                    className="w-full bg-surface border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-primary transition-colors"
                    placeholder="Ex: 10, 12, 100..."
                    value={newInv.rate}
                    onChange={(e) => setNewInv({...newInv, rate: e.target.value})}
                />
            </div>
            <p className="text-[10px] text-slate-500 pl-1">Ex: CDI ~10%, Ações ~12-15%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in pt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Carteira <span className="text-primary">Futura</span></h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/50 shadow-neon-primary"
        >
          <Plus size={20} />
        </button>
      </div>

      {investments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-surface/30 rounded-3xl border border-white/5 border-dashed">
            <TrendingUp size={40} className="text-slate-600 mb-4" />
            <h3 className="text-slate-300 font-medium">Comece a Investir</h3>
            <p className="text-slate-500 text-sm mt-1 px-8">Adicione seus aportes mensais para simular o efeito dos juros compostos.</p>
            <button onClick={() => setIsAdding(true)} className="mt-6 text-primary text-sm font-bold uppercase tracking-wider">Adicionar Primeiro Aporte</button>
          </div>
      ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Aporte Mensal Total</p>
                    <p className="text-xl font-mono font-bold text-white">{formatMoney(totalMonthlyContribution)}</p>
                </div>
                <div className="bg-surface rounded-2xl p-4 border border-white/10">
                     <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Patrimônio em 1 Ano</p>
                     <p className="text-xl font-mono font-bold text-secondary">{formatMoney(calculateProjection(1))}</p>
                </div>
            </div>

            <div className="glass rounded-3xl p-5 border border-primary/20 shadow-neon-primary">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        <Calculator size={16} className="text-primary"/> Projeção (5 Anos)
                    </h3>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded">Juros Compostos</span>
                </div>
                
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projectionData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="label" hide />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#030712', borderColor: '#374151', color: '#fff', fontSize: '12px' }}
                                formatter={(val: number) => formatMoney(val)}
                                labelStyle={{ display: 'none' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="total" 
                                stroke="#d946ef" 
                                strokeWidth={3} 
                                fill="url(#colorTotal)" 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="invested" 
                                stroke="#4b5563" 
                                strokeWidth={1} 
                                strokeDasharray="3 3"
                                fill="transparent" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
                    <div>
                        <p className="text-[10px] text-slate-400">Em 5 Anos (Acumulado)</p>
                        <p className="text-lg font-bold text-white">{formatMoney(calculateProjection(5))}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-[10px] text-slate-400">Em 10 Anos</p>
                        <p className="text-lg font-bold text-success">{formatMoney(calculateProjection(10))}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Seus Aportes</h3>
                <div className="space-y-3">
                    {investments.map(inv => (
                        <div key={inv.id} className="bg-surface border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{inv.name}</h4>
                                    <p className="text-xs text-slate-500">{formatMoney(inv.monthlyContribution)}/mês • {inv.annualRate}% a.a.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => onDeleteInvestment(inv.id)}
                                className="p-2 text-slate-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </>
      )}
    </div>
  );
};