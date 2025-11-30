import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './views/Dashboard';
import { AddTransaction } from './views/AddTransaction';
import { Analytics } from './views/Analytics';
import { Planning } from './views/Planning';
import { Settings } from './views/Settings';
import { Investments } from './views/Investments';
import { Transaction, Goal, FinancialSummary, TransactionType, Investment } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_transactions');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Erro ao carregar transações", e);
      return [];
    }
  });
  
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_goals');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_investments');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lumina_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('lumina_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('lumina_investments', JSON.stringify(investments));
  }, [investments]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentDate.getMonth() && 
             txDate.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentDate]);

  const summary: FinancialSummary = useMemo(() => {
    const projected = { income: 0, expenses: 0, balance: 0 };
    const realized = { income: 0, expenses: 0, balance: 0 };

    currentMonthTransactions.forEach(tx => {
      if (tx.type === TransactionType.INCOME) {
        projected.income += tx.amount;
      } else {
        projected.expenses += tx.amount;
      }

      if (tx.status === 'paid') {
        if (tx.type === TransactionType.INCOME) {
          realized.income += tx.amount;
        } else {
          realized.expenses += tx.amount;
        }
      }
    });

    projected.balance = projected.income - projected.expenses;
    realized.balance = realized.income - realized.expenses;

    return {
      projected,
      realized,
      savingsPotential: Math.max(0, projected.balance)
    };
  }, [currentMonthTransactions]);

  const handleAddTransaction = (newTx: any) => {
    const tx: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions([tx, ...transactions]);
    setCurrentView('dashboard');
  };

  const handleToggleStatus = (id: string) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === id 
        ? { ...tx, status: tx.status === 'paid' ? 'pending' : 'paid' } 
        : tx
    ));
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  };

  const handleAddGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
  };

  const handleAddInvestment = (inv: Investment) => {
    setInvestments([...investments, inv]);
  };

  const handleDeleteInvestment = (id: string) => {
     setInvestments(prev => prev.filter(i => i.id !== id));
  };

  const handleResetData = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os dados?')) {
      setTransactions([]);
      setGoals([]);
      setInvestments([]);
      localStorage.removeItem('lumina_transactions');
      localStorage.removeItem('lumina_goals');
      localStorage.removeItem('lumina_investments');
      alert('Dados apagados.');
    }
  };

  const handleExportData = () => {
    const data = { transactions, goals, investments, exportDate: new Date().toISOString(), version: '2.1' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.transactions)) {
          setTransactions(parsed.transactions);
          setGoals(parsed.goals || []);
          setInvestments(parsed.investments || []);
          alert('Backup restaurado!');
          setCurrentView('dashboard');
        }
      } catch (err) {
        alert('Erro ao ler arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            summary={summary} 
            recentTransactions={currentMonthTransactions} 
            currentDate={currentDate}
            onOpenSettings={() => setCurrentView('settings')}
            onMonthChange={changeMonth}
            onToggleStatus={handleToggleStatus}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'add':
        return <AddTransaction initialDate={currentDate} onSave={handleAddTransaction} onCancel={() => setCurrentView('dashboard')} />;
      case 'analytics':
        return <Analytics transactions={transactions} />; 
      case 'planning':
        return <Planning goals={goals} summary={summary} addGoal={handleAddGoal} />;
      case 'investments':
        return <Investments investments={investments} onAddInvestment={handleAddInvestment} onDeleteInvestment={handleDeleteInvestment} />;
      case 'settings':
        return <Settings onBack={() => setCurrentView('dashboard')} onReset={handleResetData} onExport={handleExportData} onImport={handleImportData} />;
      default:
        return null;
    }
  };

  // Determine if we need standard padding or if the view handles it (like AddTransaction)
  const isFullBleed = currentView === 'add';

  return (
    <div className="flex justify-center min-h-[100dvh] bg-black">
      <div className="w-full max-w-md bg-background relative flex flex-col shadow-2xl min-h-[100dvh]">
        
        {/* Top Safety Spacer */}
        <div className="shrink-0 h-safe-top bg-background/50 backdrop-blur-sm sticky top-0 z-40"></div>

        {/* Main Content - Native Flow */}
        <main className={`flex-1 ${isFullBleed ? '' : 'px-6 pb-24'}`}>
          {renderView()}
        </main>

        {/* Navbar - Fixed at bottom of viewport */}
        {currentView !== 'add' && currentView !== 'settings' && (
          <Navbar currentView={currentView} setView={setCurrentView} />
        )}
      </div>
    </div>
  );
};

export default App;