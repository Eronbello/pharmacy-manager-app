import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface IUser {
  token?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser>({})
  const token = computed(() => user.value?.token)

  function setToken(bearerToken: string) {
    user.value.token = bearerToken
    localStorage.setItem('token', bearerToken) // Armazena o token no localStorage
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch('https://naked-eydie-bellos-tech-3517c645.koyeb.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      if (data.token) {
        setToken(data.token) // Define o token na store e localStorage
      } else {
        throw new Error('Token not found in response')
      }
    } catch (error) {
      console.error('Error during login:', error)
      throw error // Opcional: Rejeitar para manipulação no componente
    }
  }

  return { token, setToken, login }
})
