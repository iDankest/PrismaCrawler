import { useState } from 'react'

// Asegúrate de que tu .env tenga VITE_API_URL=http://localhost:3000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)

    // 1. Configuramos un AbortController para evitar que la petición se quede "zombie"
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 segundos de margen

    console.log(`📡 [API-START] --> ${options.method || 'GET'} ${API_URL}${endpoint}`);

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        signal: controller.signal, // Conectamos el controlador de tiempo
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      })

      // Limpiamos el timeout si el servidor responde a tiempo
      clearTimeout(timeoutId)

      console.log(`📥 [API-RESPONSE] Status: ${response.status}`);

      // Manejo de errores de la API (400, 401, 500, etc.)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error del servidor (${response.status})`)
      }

      const data = await response.json()
      console.log('📦 [API-DATA]:', data);
      
      return data

    } catch (err) {
      clearTimeout(timeoutId)

      let errorMessage = err.message
      
      // Manejo específico si el servidor tarda demasiado
      if (err.name === 'AbortError') {
        errorMessage = 'El servidor tarda demasiado en responder. ¿Está encendido el Backend?'
      }

      console.error('❌ [API-ERROR]:', {
        message: errorMessage,
        url: `${API_URL}${endpoint}`
      })

      setError(errorMessage)
      throw new Error(errorMessage) // Re-lanzamos para que el Login.jsx sepa que falló

    } finally {
      setLoading(false) // Esto asegura que el botón "INITIALIZING" desaparezca siempre
    }
  }

  return { call, loading, error }
}