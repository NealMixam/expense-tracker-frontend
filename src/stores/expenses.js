import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref([])

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses')
      expenses.value = res.data.map((e) => ({
        ...e,
        date: new Date(e.date),
        amount: Number(e.amount),
      }))
    } catch (err) {
      console.error('Ошибка загрузки', err)
    }
  }

  const addExpense = async (expenseData) => {
    const res = await api.post('/expenses', expenseData)
    expenses.value.unshift({
      ...res.data,
      date: new Date(res.data.date),
      amount: Number(res.data.amount),
    })
  }

  const removeExpense = async (id) => {
    await api.delete(`/expenses/${id}`)
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  const updateExpense = async (expenseData) => {
    try {
      const res = await api.put(`/expenses/${expenseData.id}`, expenseData)
      const index = expenses.value.findIndex((e) => e.id === expenseData.id)

      if (index !== -1 && res.data && typeof res.data === 'object') {
        expenses.value[index] = {
          ...res.data,
          date: new Date(res.data.date),
          amount: Number(res.data.amount),
        }
      } else {
        await fetchExpenses()
      }
    } catch (err) {
      console.error('Ошибка при обновлении:', err)
    }
  }

  const chartData = computed(() => {
    const categoriesMap = {}

    expenses.value.forEach((exp) => {
      const cat = exp.category || 'Другое'
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = 0
      }
      categoriesMap[cat] += Number(exp.amount)
    })

    return {
      labels: Object.keys(categoriesMap),
      datasets: [
        {
          data: Object.values(categoriesMap),
          backgroundColor: ['#4ade80', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#94a3b8'],
          hoverBackgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
        },
      ],
    }
  })

  return { expenses, fetchExpenses, addExpense, removeExpense, updateExpense, chartData }
})
