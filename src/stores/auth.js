import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const router = useRouter()

  const register = async (username, password) => {
    try {
      const res = await api.post('/auth/register', { username, password })
      setToken(res.data.token)
    } catch (error) {
      throw error.response.data.message || 'Ошибка регистрации'
    }
  }

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password })
      setToken(res.data.token)
    } catch (error) {
      throw error.response.data.message || 'Ошибка входа'
    }
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    router.push('/')
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { token, register, login, logout }
})
