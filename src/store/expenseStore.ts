import { create } from 'zustand';
import api from '../api/axios';

export interface Expense {
  id: number;
  amount: number;
  category: string;
  title?: string;
  date: Date; 
  userId: number;
}

export type CurrencyCode = 'RUB' | 'USD' | 'EUR' | 'GEL';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatAmount: (amount: number | string) => string;
  fetchExpenses: () => Promise<void>;
  addExpense: (expenseData: Omit<Expense, 'id' | 'userId' | 'date'> & { date?: string | Date }) => Promise<void>;
  updateExpense: (id: number, expenseData: Partial<Expense>) => Promise<void>;
  removeExpense: (id: number) => Promise<void>;
  getChartData: () => {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  };
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  loading: false,
  currency: (localStorage.getItem('currency') as CurrencyCode) || 'RUB',

  setCurrency: (currency) => {
    localStorage.setItem('currency', currency);
    set({ currency });
  },

  formatAmount: (amount) => {
    const { currency } = get();
    const symbols: Record<CurrencyCode, string> = {
      RUB: "₽",
      USD: "$",
      EUR: "€",
      GEL: "₾",
    };
    return `${Number(amount).toLocaleString("ru-RU")} ${symbols[currency] || ""}`;
  },

  fetchExpenses: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/expenses');
      const formattedData: Expense[] = res.data.map((e: any) => ({
        ...e,
        date: new Date(e.date),
        amount: Number(e.amount),
      }));
      set({ expenses: formattedData });
    } catch (err) {
      console.error('Ошибка при загрузке трат:', err);
    } finally {
      set({ loading: false });
    }
  },

  addExpense: async (expenseData) => {
    try {
      const res = await api.post('/expenses', expenseData);
      const newExpense: Expense = {
        ...res.data,
        date: new Date(res.data.date),
        amount: Number(res.data.amount),
      };
      set((state) => ({
        expenses: [newExpense, ...state.expenses],
      }));
    } catch (err) {
      console.error('Ошибка при добавлении:', err);
      throw err;
    }
  },

  updateExpense: async (id, expenseData) => {
    try {
      const res = await api.put(`/expenses/${id}`, expenseData);
      const updatedExpense: Expense = {
        ...res.data,
        date: new Date(res.data.date),
        amount: Number(res.data.amount),
      };
      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === id ? updatedExpense : e)),
      }));
    } catch (err) {
      console.error('Ошибка при обновлении:', err);
      throw err;
    }
  },

  removeExpense: async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      }));
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      throw err;
    }
  },

  getChartData: () => {
    const { expenses } = get();
    const categoriesMap: Record<string, number> = {};

    expenses.forEach((exp) => {
      const cat = exp.category || 'Другое';
      if (!categoriesMap[cat]) categoriesMap[cat] = 0;
      categoriesMap[cat] += Number(exp.amount);
    });

    return {
      labels: Object.keys(categoriesMap),
      datasets: [
        {
          data: Object.values(categoriesMap),
          backgroundColor: ['#4ade80', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#94a3b8'],
          hoverBackgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
        },
      ],
    };
  },
}));