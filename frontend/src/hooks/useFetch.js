// src/hooks/useFetch.js
import { useState, useEffect } from 'react';
import api from '../api/axios'; // Importamos tu instancia de Axios

export const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Definimos la función asíncrona dentro del efecto
    const fetchData = async () => {
      try {
        setLoading(true);
        // Con Axios, la respuesta ya viene parseada en .data
        const response = await api.get(endpoint);
        setData(response.data);
      } catch (err) {
        // Capturamos el mensaje de error del backend o el de Axios
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]); // Si el endpoint cambia, se vuelve a ejecutar

  return { data, loading, error };
};