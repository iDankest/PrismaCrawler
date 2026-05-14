import { useState, useCallback } from 'react';
import api from '../api/axios';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        url: endpoint,
        method: options.method || 'GET',
        data: options.body, // Axios usa 'data' en lugar de 'body'
        ...options
      });

      return response.data; // Axios ya te da el JSON parseado aquí
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { call, loading, error };
}