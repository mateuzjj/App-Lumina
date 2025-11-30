
import React, { useState } from 'react';
import { FinancialSummary, Goal } from '../types';
import { IconMapper } from '../components/IconMapper';
import { Plus, ChevronRight, AlertCircle, Clock, Target, Calendar, Calculator, CheckCircle2 } from 'lucide-react';

interface PlanningProps {
  goals: Goal[];
  summary: FinancialSummary;
  addGoal: (goal: Goal) => void;
}

export const Planning: React.FC<PlanningProps> = ({ goals, summary, addGoal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', amount: '', current: '', deadline: '' });

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Capacidade atual de poupança (Receitas - Despesas Previstas)
  const monthlySurplus = summary.savingsPotential;
  
  const handleAdd = () => {
    if (newGoal.name && newGoal.amount) {
      addGoal({
        id: Math.random().toString(36).substr(2, 9),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.amount),
        currentAmount: parseFloat(newGoal.current) || 0,
        deadline: newGoal.deadline || undefined,
        icon: 'Target'
      });
      setIsAdding(false);
      setNewGoal({ name: '', amount: '', current: '', deadline: '' });
    }
  };

  if (isAdding) {
    return (
      <div className="pb-24 pt-4 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setIsAdding(false)} className="text-slate-400">Cancelar</button>
          <h2 className="text-lg font-semibold text-white">Novo Objetivo</h2>
          <button onClick={handleAdd} className="text-primary font-semibold">Salvar</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Nome do Objetivo</label>
            <input 
              className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition-colors"
              placeholder="Ex: Viagem Paris, iPhone 15..."
              value={newGoal.name}
              onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold">Valor da Meta</label>
                <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">R$</span>
                <input 
                    type="number"
                    className="w-full bg-surface border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-primary transition-colors"
                    placeholder="0,00"
                    value={newGoal.amount}
                    onChange={(e) => setNewGoal({...newGoal, amount: e.target.value})}
                />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold">Já Guardado</label>
                <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">R$</span>
                <input 
                    type="number"
                    className="w-full bg-surface border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-primary transition-colors"
                    placeholder="0,00"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                />
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Data Limite (Prazo)</label>
            <div className="relative">
                <Calendar className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                    type="date"
                    className="w-full bg-surface border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-primary transition-colors appearance-none"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
            </div>
          </div>
          
          {/* Simulation Preview during add */}
          {newGoal.amount && newGoal.deadline && (
              <div className="bg-surface/50 p-4 rounded-xl border border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Calculator size={14} className="text-secondary" /> Simulação
                  </h4>
                  {(() => {
                      const amount = parseFloat(newGoal.amount);
                      const current = parseFloat(newGoal.current) || 0;
                      const remaining = amount - current;
                      const targetDate = new Date(newGoal.deadline);
                      const today = new Date();
                      
                      // Month diff
                      let months = (targetDate.getFullYear() - today.getFullYear()) * 12;
                      months -= today.getMonth();
                      months += targetDate.getMonth();
                      months = Math.max(1, months);

                      const requiredMonthly = remaining / months;
                      const isPossible = monthlySurplus >= requiredMonthly;

                      return (
                          <div className="text-xs space-y-1">
                              <p className="text-slate-400">Para juntar <span className="text-white">{formatMoney(remaining)}</span> em <span className="text-white">{months} meses</span>:</p>
                              <div className="flex justify-between items-center mt-2 p-2 bg-black/20 rounded">
                                  <span>Precisa guardar:</span>
                                  <span className="font-bold text-secondary">{formatMoney(requiredMonthly)}/mês</span>
                              </div>
                              <div className="mt-2 pt-2 border-t border-white/5">
                                  {isPossible ? (
                                      <span className="text-success flex items-center gap-1">
                                          <CheckCircle2 size={12} /> Sua economia atual de {formatMoney(monthlySurplus)} cobre isso!
                                      </span>
                                  ) : (
                                      <span className="text-danger flex items-center gap-1">
                                          <AlertCircle size={12} /> Faltam {formatMoney(requiredMonthly - monthlySurplus)} na sua economia mensal.
                                      </span>
                                  )}
                              </div>
                          </div>
                      );
                  })()}
              </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in pt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Planejamento</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/50"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Projection Summary */}
      <div className="bg-surface/50 border border-white/5 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sua capacidade atual de poupança é de <span className="text-emerald-400 font-bold">{formatMoney(monthlySurplus)}</span> por mês baseada na sua projeção mensal.
          </p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = goal.targetAmount - goal.currentAmount;
          
          // Logic Calculation for Display
          let feedback = null;

          if (goal.deadline) {
             const targetDate = new Date(goal.deadline);
             const today = new Date();
             let months = (targetDate.getFullYear() - today.getFullYear()) * 12;
             months -= today.getMonth();
             months += targetDate.getMonth();
             months = Math.max(1, months);
             
             const required = remaining / months;
             const diff = monthlySurplus - required;

             feedback = (
                 <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        <span>Meta: {targetDate.toLocaleDateString('pt-BR')}</span>
                        <span>{months} meses rest.</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-300">Necessário: {formatMoney(required)}/mês</span>
                        {monthlySurplus > 0 ? (
                            diff >= 0 ? 
                            <span className="text-success font-bold flex items-center gap-1"><CheckCircle2 size={10}/> No Caminho</span> : 
                            <span className="text-danger font-bold flex items-center gap-1"><AlertCircle size={10}/> Falta {formatMoney(Math.abs(diff))}</span>
                        ) : (
                            <span className="text-danger font-bold">Sem poupança</span>
                        )}
                    </div>
                 </div>
             );
          } else {
             // Fallback logic if no deadline
             const monthsToReach = monthlySurplus > 0 ? Math.ceil(remaining / monthlySurplus) : Infinity;
             feedback = (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                    {monthlySurplus > 0 ? (
                        <>
                            <Clock size={14} className="text-secondary" />
                            <p className="text-xs text-slate-300">
                                Previsão: <strong className="text-white">{monthsToReach === Infinity ? 'Indefinido' : `${monthsToReach} meses`}</strong> mantendo o ritmo atual.
                            </p>
                        </>
                    ) : (
                        <>
                            <AlertCircle size={14} className="text-rose-400" />
                            <p className="text-xs text-rose-300">Aumente sua renda ou reduza gastos.</p>
                        </>
                    )}
                </div>
             );
          }
          
          return (
            <div key={goal.id} className="bg-surface border border-white/5 rounded-3xl p-5 relative overflow-hidden group">
              {/* Progress Bar Background */}
              <div className="absolute bottom-0 left-0 h-1 bg-slate-700 w-full">
                <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-700/50 flex items-center justify-center text-white">
                    <IconMapper iconName={goal.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{goal.name}</h3>
                    <p className="text-xs text-slate-400">{formatMoney(goal.currentAmount)} de {formatMoney(goal.targetAmount)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">{percentage}%</span>
                </div>
              </div>

              {feedback}
            </div>
          );
        })}

        {goals.length === 0 && (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <Target size={32} />
                </div>
                <h3 className="text-slate-300 font-medium">Nenhum objetivo ainda</h3>
                <p className="text-slate-500 text-sm mt-1">Defina uma meta, prazo e valor para começar.</p>
            </div>
        )}
      </div>
    </div>
  );
};
