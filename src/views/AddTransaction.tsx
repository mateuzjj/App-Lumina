import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../constants';
import { TransactionType, Frequency, TransactionStatus, PaymentMethod } from '../types';
import { IconMapper } from '../components/IconMapper';
import { Check, X, Calendar, Type, Delete, MoreHorizontal } from 'lucide-react';

interface AddTransactionProps {
  initialDate: Date;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ initialDate, onSave, onCancel }) => {
  const [rawValue, setRawValue] = useState(0); 
  const [note, setNote] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE_VARIABLE);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(initialDate.toISOString().split('T')[0]);
  
  const [showExtras, setShowExtras] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [status, setStatus] = useState<TransactionStatus>('paid');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const el = document.getElementById(`cat-${category}`);
    if (el && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
        container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [category]);

  const currentCategory = CATEGORIES.find(c => c.id === category);

  return (
    <div className="fixed inset-0 bg-[#030712] z-50 flex flex-col animate-slide-up h-full overflow-hidden select-none">
      
      <div className="flex justify-between items-center px-6 pt-6 pb-2 relative z-20">
        <button onClick={onCancel} className="p-3 -ml-3 text-slate-400 hover:text-white active:scale-90 transition-all rounded-full hover:bg-white/5">
          <X size={24} />
        </button>
        
        <div className="flex bg-surface rounded-full p-1 border border-white/10 shadow-lg relative">
            <button 
                onClick={() => setType(TransactionType.EXPENSE_VARIABLE)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all duration-300 z-10 ${type !== TransactionType.INCOME ? 'bg-danger text-white shadow-lg shadow-danger/20 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Saída
            </button>
            <button 
                onClick={() => setType(TransactionType.INCOME)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all duration-300 z-10 ${type === TransactionType.INCOME ? 'bg-success text-black shadow-lg shadow-success/20 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Entrada
            </button>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative -mt-8 z-10">
         <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 opacity-70">Valor da Transação</span>
         
         <div className="flex items-baseline gap-1 px-4 scale-125 origin-center">
             <span className={`text-3xl font-mono font-medium mb-1 opacity-60 ${type === TransactionType.INCOME ? 'text-success' : 'text-danger'}`}>R$</span>
             <span className={`text-6xl font-bold tracking-tighter transition-all duration-200 ${rawValue === 0 ? 'text-slate-700' : 'text-white'}`}>
                {getFormattedValue()}
             </span>
             <div className="w-1 h-12 bg-primary/50 cursor-blink ml-1 rounded-full"></div>
         </div>
         
         <div className="mt-12 w-full max-w-[280px]">
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

      <div className="bg-[#111827] rounded-t-[36px] border-t border-white/5 pb-8 shadow-[0_-10px_60px_rgba(0,0,0,0.6)] flex flex-col h-auto max-h-[60%] backdrop-blur-3xl relative z-20">
        
        <div className="pt-6 pb-2">
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto px-[50%] gap-6 no-scrollbar snap-x snap-mandatory py-2 items-end h-24"
                style={{ scrollBehavior: 'smooth' }}
            >
                {CATEGORIES.map(cat => {
                    const isSelected = category === cat.id;
                    return (
                        <button
                            key={cat.id}
                            id={`cat-${cat.id}`}
                            onClick={() => setCategory(cat.id)}
                            className={`snap-center shrink-0 flex flex-col items-center gap-3 group transition-all duration-500 ease-out ${isSelected ? 'scale-110 -translate-y-1 opacity-100' : 'scale-90 opacity-40'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isSelected ? cat.color + ' shadow-[0_0_25px_rgba(255,255,255,0.1)] ring-2 ring-white/20' : 'bg-slate-800 text-slate-500'}`}>
                                <IconMapper iconName={cat.icon} className="w-7 h-7" />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${isSelected ? 'text-white' : 'text-transparent'}`}>
                                {cat.name.split('/')[0]}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>

        <div className="px-6 flex items-center justify-between mb-4 mt-auto">
            <div className="flex gap-3">
                <div className="relative group">
                    <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)} 
                        className="absolute inset-0 opacity-0 z-10 w-full h-full cursor-pointer"
                    />
                    <button className="w-14 h-14 bg-surface border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 group-active:scale-95 transition-all">
                        <Calendar size={22} />
                    </button>
                </div>

                <button 
                    onClick={() => setShowExtras(!showExtras)}
                    className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all active:scale-95 ${showExtras ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-white/10 text-slate-400'}`}
                >
                    <MoreHorizontal size={22} />
                </button>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={rawValue === 0}
                className={`h-14 px-8 rounded-2xl flex items-center gap-3 font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${
                    type === TransactionType.INCOME 
                    ? 'bg-success text-black shadow-success/20 hover:bg-emerald-400' 
                    : 'bg-primary text-white shadow-primary/20 hover:bg-fuchsia-500'
                } ${rawValue === 0 ? 'opacity-30 grayscale cursor-not-allowed' : 'opacity-100'}`}
            >
                <Check size={22} strokeWidth={3} />
                <span>Salvar</span>
            </button>
        </div>

        {showExtras && (
            <div className="px-6 pb-2 animate-fade-in grid grid-cols-2 gap-3 mb-2">
                 <div className="bg-surface p-3 rounded-xl border border-white/5">
                     <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Status</span>
                     <div className="flex bg-black/30 p-1 rounded-lg">
                         <button onClick={() => setStatus('paid')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${status === 'paid' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>Pago</button>
                         <button onClick={() => setStatus('pending')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${status === 'pending' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>Pend.</button>
                     </div>
                 </div>
                 <div className="bg-surface p-3 rounded-xl border border-white/5">
                     <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Pagamento</span>
                     <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full bg-black/30 text-white text-xs p-2 rounded-lg outline-none border border-transparent focus:border-white/10"
                     >
                         {PAYMENT_METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                     </select>
                 </div>
            </div>
        )}

        <div className="grid grid-cols-3 gap-3 px-6 pb-safe mt-2">
            {['1','2','3','4','5','6','7','8','9'].map((digit) => (
                <button
                    key={digit}
                    onClick={() => handleDigitPress(digit)}
                    className="h-12 rounded-2xl text-xl font-medium text-white bg-white/5 hover:bg-white/10 active:bg-white/20 transition-all active:scale-95 duration-100 outline-none select-none touch-manipulation shadow-sm shadow-black/20"
                >
                    {digit}
                </button>
            ))}
            <div className="h-12"></div>
            
            <button
                onClick={() => handleDigitPress('0')}
                className="h-12 rounded-2xl text-xl font-medium text-white bg-white/5 hover:bg-white/10 active:bg-white/20 transition-all active:scale-95 duration-100 outline-none select-none touch-manipulation shadow-sm shadow-black/20"
            >
                0
            </button>
            
            <button
                onClick={handleBackspace}
                className="h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-danger hover:bg-danger/10 transition-all active:scale-95 duration-100 outline-none select-none touch-manipulation"
            >
                <Delete size={22} strokeWidth={2} />
            </button>
        </div>
      </div>
    </div>
  );
};