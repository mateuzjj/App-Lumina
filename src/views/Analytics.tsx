import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Zap, Calendar, Wallet } from 'lucide-react';

interface AnalyticsProps {
  transactions: Transaction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(val);
  };

  const historyData = useMemo(() => {
    const dataMap: Record<string, { date: Date, income: number, expense: number }> = {};
    
    transactions.forEach(tx => {
       const date = new Date(tx.date);
       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
       
       if (!dataMap[key]) {
         dataMap[key] = { date, income: 0, expense: 0 };
       }
       
       if (tx.type === TransactionType.INCOME) {
         dataMap[key].income += tx.amount;
       } else {
         dataMap[key].expense += tx.amount;
       }
    });

    const sortedKeys = Object.keys(dataMap).sort();
    
    let runningBalance = 0;
    const monthlyData = sortedKeys.map(key => {
        const item = dataMap[key];
        const monthlyResult = item.income - item.expense;
        runningBalance += monthlyResult;
        
        return {
            key,
            label: item.date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }).toUpperCase(),
            fullLabel: item.date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
            income: item.income,
            expense: item.expense,
            monthlyResult,
            runningBalance
        };
    });

    const totalIncome = monthlyData.reduce((acc, curr) => acc + curr.income, 0);
    const totalExpense = monthlyData.reduce((acc, curr) => acc + curr.expense, 0);
    const totalBalance = totalIncome - totalExpense;

    return { monthlyData, totalIncome, totalExpense, totalBalance };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const rawMap = transactions
      .filter(t => t.type !== TransactionType.INCOME)
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(rawMap)
      .map(([catId, value]) => {
        const cat = CATEGORIES.find(c => c.id === catId);
        return {
          name: cat?.name.split('/')[0] || 'Outros',
          value,
          color: cat?.color || 'bg-slate-500', 
          rawColor: cat?.color.includes('cyan') ? '#06b6d4' : 
                    cat?.color.includes('fuchsia') ? '#d946ef' :
                    cat?.color.includes('red') ? '#f43f5e' :
                    cat?.color.includes('emerald') ? '#10b981' :
                    cat?.color.includes('yellow') ? '#eab308' : '#8b5cf6'
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-neon-primary">
          <Activity size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sem Dados para Análise</h2>
        <p className="text-slate-400">Adicione suas receitas e despesas para desbloquear o panorama geral.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 animate-fade-in pt-4">
      <div className="flex items-center gap-2">
        <Activity className="text-primary" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Panorama <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Geral</span></h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-surface border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-neon-primary">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                <Wallet size={14} /> Saldo Acumulado Total
            </h3>
            <p className={`text-3xl font-bold font-mono ${historyData.totalBalance >= 0 ? 'text-white' : 'text-danger'}`}>
                {formatMoney(historyData.totalBalance)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                        <TrendingUp size={10} className="text-success" /> Total Receitas
                    </span>
                    <p className="text-lg font-mono text-success">{formatMoney(historyData.totalIncome)}</p>
                </div>
                <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                        <TrendingDown size={10} className="text-danger" /> Total Despesas
                    </span>
                    <p className="text-lg font-mono text-danger">{formatMoney(historyData.totalExpense)}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-5 border border-white/10 relative">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Zap size={14} className="text-secondary" />
            Fluxo de Caixa (Histórico)
          </h2>
        </div>
        
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData.monthlyData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff0055" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff0055" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="label" 
                stroke="#4b5563" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#030712', borderColor: '#374151', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                formatter={(value: number) => formatMoney(value)}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                name="Receitas"
                stroke="#00ff9d" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                name="Despesas"
                stroke="#ff0055" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Detalhamento Mensal</h3>
        <div className="space-y-2">
            {historyData.monthlyData.slice().reverse().map((month) => (
                <div key={month.key} className="bg-surface border border-white/5 rounded-2xl p-4 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-800 rounded-lg text-slate-300">
                                <Calendar size={14} />
                            </div>
                            <span className="text-white font-bold capitalize">{month.fullLabel}</span>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${month.monthlyResult >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {month.monthlyResult >= 0 ? 'Superávit' : 'Déficit'}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        <div className="bg-background/50 p-2 rounded-lg">
                            <span className="block text-[8px] text-slate-500 uppercase">Receita</span>
                            <span className="text-success">{formatMoney(month.income)}</span>
                        </div>
                        <div className="bg-background/50 p-2 rounded-lg">
                            <span className="block text-[8px] text-slate-500 uppercase">Despesa</span>
                            <span className="text-danger">{formatMoney(month.expense)}</span>
                        </div>
                        <div className="bg-background/50 p-2 rounded-lg border border-white/5">
                            <span className="block text-[8px] text-slate-500 uppercase">Saldo</span>
                            <span className={month.monthlyResult >= 0 ? "text-blue-400" : "text-rose-400"}>
                                {month.monthlyResult > 0 ? '+' : ''}{formatMoney(month.monthlyResult)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 border border-secondary/20 shadow-neon-secondary mt-8">
            <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-secondary" />
                Maiores Gastos (Histórico)
            </h3>
            
            <div className="h-48 w-full">
                {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData.slice(0, 5)} layout="vertical" margin={{ left: 0, right: 30 }}>
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                stroke="#9ca3af" 
                                fontSize={10} 
                                width={70} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ backgroundColor: '#030712', borderColor: '#374151', color: '#fff' }}
                                formatter={(val: number) => formatMoney(val)}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                                {categoryData.slice(0, 5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.rawColor} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-600 text-xs">
                        Dados insuficientes
                    </div>
                )}
            </div>
      </div>

    </div>
  );
};