
export enum TransactionType {
  INCOME = 'income',
  EXPENSE_FIXED = 'expense_fixed',
  EXPENSE_VARIABLE = 'expense_variable'
}

export enum Frequency {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  ONE_TIME = 'one_time'
}

export type TransactionStatus = 'paid' | 'pending';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'other';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string; // Category ID
  frequency: Frequency;
  date: string; // ISO String
  note?: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO String Date
  icon: string;
}

export interface Investment {
  id: string;
  name: string;
  monthlyContribution: number;
  annualRate: number; // Porcentagem anual
  startDate: string;
}

export interface FinancialSummary {
  realized: {
    income: number;
    expenses: number;
    balance: number;
  };
  projected: {
    income: number;
    expenses: number;
    balance: number;
  };
  savingsPotential: number;
}
