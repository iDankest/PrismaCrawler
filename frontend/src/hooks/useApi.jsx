import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        ...options
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en la API')
      }

      const data = await response.json()
      return data

    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { call, loading, error }
}