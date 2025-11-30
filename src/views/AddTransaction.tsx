import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../constants';
import { TransactionType, Frequency, TransactionStatus, PaymentMethod } from '../types';
import { IconMapper } from '../components/IconMapper';
import { Check, X, Calendar, Type, Delete, ChevronUp, ArrowDown } from 'lucide-react';

interface AddTransactionProps {
  initialDate: Date;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ initialDate, onSave, onCancel }) => {
  // --- Estados de Dados ---
  const [rawValue, setRawValue] = useState(0); 
  const [note, setNote] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE_VARIABLE);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(initialDate.toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [status, setStatus] = useState<TransactionStatus>('paid');

  // --- Estado de Controle de Visualização (O "Elevador") ---
  // 0 = Etapa 1 (Valor e Teclado), 1 = Etapa 2 (Categoria e Detalhes)
  const [currentStep, setCurrentStep] = useState<0 | 1>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Lógica do Teclado ---
  const handleDigitPress = (digit: string) => {
    setRawValue(prev => {
      const num = parseInt(digit);
      if (prev > 99999999) return prev; 
      return (prev * 10) + num;
    });
  };

  const handleBackspace = () => {
    setRawValue(prev => Math.floor(prev / 10));
  };

  const getFormattedValue = () => {
    const val = rawValue / 100;
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSubmit = () => {
    const finalValue = rawValue / 100;
    if (finalValue <= 0) return;
    
    const submitDate = new Date(date);
    submitDate.setHours(12, 0, 0, 0); 

    onSave({
      amount: finalValue,
      note,
      type,
      category,
      frequency: Frequency.ONE_TIME,
      date: submitDate.toISOString(),
      status,
      paymentMethod
    });
  };

  // Scroll horizontal para categoria selecionada
  useEffect(() => {
    if (currentStep === 1) {
        setTimeout(() => {
            const el = document.getElementById(`cat-${category}`);
            if (el && scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
                container.scrollTo({ left: offset, behavior: 'smooth' });
            }
        }, 300); // Delay para permitir a transição
    }
  }, [category, currentStep]);

  // Função para "Subir e Descer"
  const toggleStep = () => {
    setCurrentStep(prev => prev === 0 ? 1 : 0);
  };

  return (
    <div className="fixed inset-0 bg-[#030712] z-[60] flex flex-col overflow-hidden">
      
      {/* 1. Header Fixo (Sempre visível) */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 pt-safe mt-4 flex justify-between items-center pointer-events-none">
        <button onClick={onCancel} className="pointer-events-auto p-3 -ml-3 text-slate-400 hover:text-white active:scale-90 transition-all rounded-full bg-black/40 backdrop-blur-md border border-white/5">
          <X size={24} />
        </button>

        {/* Indicador de Etapa */}
        <div className="flex gap-1.5 pointer-events-auto bg-black/20 p-2 rounded-full backdrop-blur-sm">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep === 0 ? 'bg-primary w-6' : 'bg-white/20'}`}></div>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep === 1 ? 'bg-primary w-6' : 'bg-white/20'}`}></div>
        </div>
      </div>

      {/* --- TELA 1: VALOR & TECLADO --- */}
      <div 
        className={`absolute inset-0 flex flex-col bg-[#030712] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${currentStep === 0 ? 'translate-y-0' : '-translate-y-full'}`}
      >
            <div className="flex-1 flex flex-col relative pt-20 pb-4">
                {/* Toggle Tipo */}
                <div className="flex justify-center mb-6 shrink-0">
                    <div className="flex bg-surface rounded-full p-1 border border-white/10 shadow-lg relative">
                        <button 
                            onClick={() => setType(TransactionType.EXPENSE_VARIABLE)}
                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all duration-300 ${type !== TransactionType.INCOME ? 'bg-danger text-white shadow-lg shadow-danger/20 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Saída
                        </button>
                        <button 
                            onClick={() => setType(TransactionType.INCOME)}
                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all duration-300 ${type === TransactionType.INCOME ? 'bg-success text-black shadow-lg shadow-success/20 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Entrada
                        </button>
                    </div>
                </div>

                {/* Display Valor */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 opacity-70">Quanto?</span>
                    <div className="flex items-baseline gap-1 px-4 scale-125 origin-center transition-all duration-300" style={{ transform: rawValue > 0 ? 'scale(1.25)' : 'scale(1)' }}>
                        <span className={`text-3xl font-mono font-medium mb-1 opacity-60 ${type === TransactionType.INCOME ? 'text-success' : 'text-danger'}`}>R$</span>
                        <span className={`text-6xl font-bold tracking-tighter transition-all duration-200 ${rawValue === 0 ? 'text-slate-700' : 'text-white'}`}>
                            {getFormattedValue()}
                        </span>
                        <div className="w-1 h-12 bg-primary/50 cursor-blink ml-1 rounded-full"></div>
                    </div>

                    {/* Input Nota */}
                    <div className="mt-8 w-full max-w-[280px]">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:bg-white/10 focus-within:border-white/20 transition-all duration-300">
                            <Type size={16} className="text-slate-500" />
                            <input 
                                type="text" 
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="Descrição (Opcional)"
                                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-slate-600 font-medium"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Teclado Customizado */}
            <div className="bg-[#111827] rounded-t-[36px] border-t border-white/5 shadow-[0_-10px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl pb-safe pt-6 px-6 shrink-0 z-20">
                <div className="grid grid-cols-3 gap-2 h-64 mb-4">
                    {['1','2','3','4','5','6','7','8','9'].map((digit) => (
                        <button
                            key={digit}
                            onClick={() => handleDigitPress(digit)}
                            className="rounded-xl text-2xl font-medium text-white hover:bg-white/5 active:bg-white/10 active:scale-90 transition-all duration-100 outline-none select-none touch-manipulation"
                        >
                            {digit}
                        </button>
                    ))}
                    <div className="rounded-xl flex items-center justify-center"></div> 
                    <button
                        onClick={() => handleDigitPress('0')}
                        className="rounded-xl text-2xl font-medium text-white hover:bg-white/5 active:bg-white/10 active:scale-90 transition-all duration-100 outline-none select-none touch-manipulation"
                    >
                        0
                    </button>
                    <button
                        onClick={handleBackspace}
                        className="rounded-xl flex items-center justify-center text-slate-400 hover:text-danger hover:bg-danger/10 active:scale-90 transition-all duration-100 outline-none select-none touch-manipulation"
                    >
                        <Delete size={28} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
      </div>

      {/* --- TELA 2: DETALHES --- */}
      <div 
        className={`absolute inset-0 flex flex-col bg-gradient-to-b from-[#030712] to-[#0f172a] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${currentStep === 1 ? 'translate-y-0' : 'translate-y-full'}`}
      >
             <div className="flex-1 flex flex-col pt-24 px-6 pb-32 overflow-y-auto no-scrollbar">
                {/* Resumo Rápido */}
                <div className="text-center mb-8 shrink-0" onClick={() => setCurrentStep(0)}>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Resumo</p>
                    <div className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                        {type === TransactionType.INCOME ? '+' : '-'} {getFormattedValue()}
                        <span className="text-xs font-normal text-slate-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5">Editar</span>
                    </div>
                </div>

                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 pl-1">Escolha a Categoria</p>
                <div className="grid grid-cols-4 gap-4 mb-8 shrink-0">
                    {CATEGORIES.map(cat => {
                    const isSelected = category === cat.id;
                    return (
                        <button
                            key={cat.id}
                            id={`cat-${cat.id}`}
                            onClick={() => setCategory(cat.id)}
                            className={`flex flex-col items-center gap-2 group transition-all duration-300 ${isSelected ? 'scale-110 opacity-100' : 'opacity-50 hover:opacity-80'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isSelected ? cat.color + ' shadow-[0_0_15px_rgba(255,255,255,0.1)] ring-2 ring-white/20 border-transparent' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
                                <IconMapper iconName={cat.icon} className="w-6 h-6" />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-tight text-center leading-tight h-6 overflow-hidden ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                {cat.name.split('/')[0]}
                            </span>
                        </button>
                    )
                })}
                </div>

                {/* Extras Container */}
                <div className="space-y-3 shrink-0">
                    {/* Data */}
                    <div className="bg-surface p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Calendar size={18} /></div>
                            <span className="text-sm text-slate-300 font-medium">Data</span>
                        </div>
                        <div className="relative">
                        <input 
                            type="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)} 
                            className="absolute inset-0 opacity-0 w-full cursor-pointer"
                        />
                        <span className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                            {new Date(date).toLocaleDateString('pt-BR')}
                        </span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-surface p-3 rounded-2xl border border-white/5">
                        <div className="flex bg-black/30 p-1 rounded-xl">
                            <button onClick={() => setStatus('paid')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === 'paid' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                                Pago
                            </button>
                            <button onClick={() => setStatus('pending')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === 'pending' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                                Pendente
                            </button>
                        </div>
                    </div>

                    {/* Pagamento */}
                    <div className="bg-surface p-3 rounded-2xl border border-white/5">
                        <div className="grid grid-cols-5 gap-1">
                            {PAYMENT_METHODS.map(m => {
                                const isActive = paymentMethod === m.id;
                                return (
                                    <button
                                    key={m.id}
                                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${isActive ? 'bg-primary/20 border-primary/50 text-white' : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5'}`}
                                    >
                                        <IconMapper iconName={m.icon} className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
             </div>
      </div>

      {/* 3. CONTROLADOR FLUTUANTE (O "Botão de Subir e Descer") */}
      <div className="absolute bottom-6 right-6 z-[70] flex flex-col gap-4 items-end pb-safe">
          
          {/* Botão de Navegação / Ação Principal */}
          {currentStep === 0 ? (
              <button 
                onClick={toggleStep}
                disabled={rawValue === 0}
                className={`h-16 w-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-[#030712] transition-all duration-300 hover:scale-110 active:scale-95 ${rawValue > 0 ? 'bg-white text-black animate-bounce-gentle' : 'bg-slate-800 text-slate-500 opacity-50'}`}
              >
                  <ArrowDown size={32} strokeWidth={3} />
              </button>
          ) : (
              <div className="flex flex-col gap-3 items-end animate-slide-up">
                  {/* Botão Voltar Pequeno */}
                  <button 
                    onClick={toggleStep}
                    className="h-12 w-12 rounded-full bg-surface border border-white/10 text-slate-400 flex items-center justify-center shadow-lg active:scale-90 transition-all"
                  >
                      <ChevronUp size={24} />
                  </button>

                  {/* Botão Salvar Grande */}
                  <button 
                    onClick={handleSubmit}
                    className={`h-16 px-8 rounded-full flex items-center gap-3 font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)] border-4 border-[#030712] hover:scale-105 active:scale-95 ${
                        type === TransactionType.INCOME 
                        ? 'bg-success text-black shadow-success/30' 
                        : 'bg-primary text-white shadow-primary/30'
                    }`}
                  >
                    <Check size={28} strokeWidth={3} />
                    <span>Salvar</span>
                  </button>
              </div>
          )}
      </div>

    </div>
  );
};