import { create } from "zustand";
import api from "../api/axios";

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  loading: false,

  fetchExpenses: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/expenses");
      const formattedData = res.data.map((e) => ({
        ...e,
        date: new Date(e.date),
        amount: Number(e.amount),
      }));
      set({ expenses: formattedData });
    } catch (err) {
      console.error("Ошибка при загрузке трат:", err);
    } finally {
      set({ loading: false });
    }
  },

  addExpense: async (expenseData) => {
    try {
      const res = await api.post("/expenses", expenseData);
      const newExpense = {
        ...res.data,
        date: new Date(res.data.date),
        amount: Number(res.data.amount),
      };
      set((state) => ({
        expenses: [newExpense, ...state.expenses],
      }));
    } catch (err) {
      console.error("Ошибка при добавлении:", err);
      throw err;
    }
  },

  updateExpense: async (id, expenseData) => {
    try {
      const res = await api.put(`/expenses/${id}`, expenseData);
      const updatedExpense = {
        ...res.data,
        date: new Date(res.data.date),
        amount: Number(res.data.amount),
      };
      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === id ? updatedExpense : e)),
      }));
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
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
      console.error("Ошибка при удалении:", err);
      throw err;
    }
  },

  getChartData: () => {
    const { expenses } = get();
    const categoriesMap = {};

    expenses.forEach((exp) => {
      const cat = exp.category || "Другое";
      if (!categoriesMap[cat]) categoriesMap[cat] = 0;
      categoriesMap[cat] += Number(exp.amount);
    });

    return {
      labels: Object.keys(categoriesMap),
      datasets: [
        {
          data: Object.values(categoriesMap),
          backgroundColor: [
            "#4ade80",
            "#60a5fa",
            "#fbbf24",
            "#f87171",
            "#a78bfa",
            "#94a3b8",
          ],
          hoverBackgroundColor: [
            "#22c55e",
            "#3b82f6",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#64748b",
          ],
        },
      ],
    };
  },
}));
