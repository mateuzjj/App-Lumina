import { Category } from './types';

// Categories Definitions
export const CATEGORIES: Category[] = [
  { id: 'rent', name: 'Aluguel/Moradia', icon: 'Home', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'streaming', name: 'Streaming/Apps', icon: 'Music', color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' },
  { id: 'travel', name: 'Viagens', icon: 'Plane', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { id: 'food', name: 'Alimentação', icon: 'Coffee', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { id: 'shopping', name: 'Compras', icon: 'ShoppingBag', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  { id: 'utilities', name: 'Contas (Luz/Água)', icon: 'Zap', color: 'text-yellow-300 bg-yellow-400/10 border-yellow-400/20' },
  { id: 'transport', name: 'Transporte', icon: 'Car', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { id: 'internet', name: 'Internet/Celular', icon: 'Wifi', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'salary', name: 'Salário', icon: 'Briefcase', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'health', name: 'Saúde', icon: 'HeartPulse', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'entertainment', name: 'Lazer', icon: 'Gamepad2', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
];

export const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Crédito', icon: 'CreditCard' },
  { id: 'debit_card', label: 'Débito', icon: 'CreditCard' },
  { id: 'pix', label: 'Pix', icon: 'QrCode' },
  { id: 'cash', label: 'Dinheiro', icon: 'Banknote' },
  { id: 'other', label: 'Outro', icon: 'Wallet' },
];

export const MOCK_TRANSACTIONS = [];
export const MOCK_GOALS = [];