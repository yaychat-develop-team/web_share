import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const token = ref(localStorage.getItem('user_token') || '')

  function setLoading(val: boolean) {
    loading.value = val
  }

  function setToken(val: string) {
    token.value = val
    if (val) {
      localStorage.setItem('user_token', val)
    } else {
      localStorage.removeItem('user_token')
    }
  }

  return { loading, token, setLoading, setToken }
})
