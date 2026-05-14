// src/hooks/useItemsCache.js

import { useState, useEffect } from 'react'
import api from '../api/axios'

const STORAGE_KEY = 'prismaCrawler_items'
const CACHE_VERSION = 1 // Incrementa esto si cambias la estructura

/**
 * ✅ Hook para cargar y cachear items
 * - Primero intenta localStorage
 * - Si no hay, pide al backend UNA SOLA VEZ
 * - Guarda en localStorage
 */
export const useItemsCache = () => {
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadItems = async () => {
      try {
        // 1️⃣ Intentar cargar del localStorage
        const cached = localStorage.getItem(STORAGE_KEY)
        
        if (cached) {
          const { version, data, timestamp } = JSON.parse(cached)
          
          // Verificar que la versión sea compatible
          if (version === CACHE_VERSION) {
            console.log('✅ Items cargados del localStorage')
            setItems(data)
            setLoading(false)
            return
          }
        }
        
        // 2️⃣ Si no hay cache válido, pedir al backend
        console.log('📡 Pidiendo items al backend...')
        const response = await api.get('/game/items')
        
        const dbItems = response.data.data || []
        
        // 3️⃣ Convertir a formato que Phaser necesita
        const itemsMap = {}
        dbItems.forEach(item => {
          itemsMap[item.spriteKey] = {
            id: item.id,
            name: item.name,
            description: item.description,
            rarity: item.rarity,
            effects: item.effects || [],
            spriteKey: item.spriteKey,
            consumable: item.isConsumable || false
          }
        })
        
        // 4️⃣ Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          version: CACHE_VERSION,
          data: itemsMap,
          timestamp: new Date().toISOString()
        }))
        
        console.log('✅ Items guardados en localStorage')
        setItems(itemsMap)
      } catch (err) {
        console.error('❌ Error cargando items:', err.message)
        setError(err.message)
        setItems({}) // Items vacíos, fallback
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  /**
   * 🔄 LIMPIAR CACHE (si cambias los items en la BD)
   */
  const clearCache = () => {
    localStorage.removeItem(STORAGE_KEY)
    console.log('🗑️ Cache limpiado')
  }

  /**
   * 🔄 FORZAR ACTUALIZACIÓN desde backend
   */
  const refreshFromBackend = async () => {
    try {
      setLoading(true)
      console.log('📡 Actualizando items desde backend...')
      
      const response = await api.get('/game/items')
      const dbItems = response.data.data || []
      
      const itemsMap = {}
      dbItems.forEach(item => {
        itemsMap[item.spriteKey] = {
          id: item.id,
          name: item.name,
          description: item.description,
          rarity: item.rarity,
          effects: item.effects || [],
          spriteKey: item.spriteKey,
          consumable: item.isConsumable || false
        }
      })
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CACHE_VERSION,
        data: itemsMap,
        timestamp: new Date().toISOString()
      }))
      
      console.log('✅ Items actualizados')
      setItems(itemsMap)
    } catch (err) {
      console.error('❌ Error actualizando items:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { items, loading, error, clearCache, refreshFromBackend }
}