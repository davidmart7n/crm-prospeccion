import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStages() {
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) { console.error('Error fetching stages:', error.message, error.code) }
    if (!error) setStages(data)
    setLoading(false)
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') fetchStages()
    })
    fetchStages()
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/set-state-in-effect

  const createStage = async (stage) => {
    const maxOrder = stages.length > 0 ? Math.max(...stages.map(s => s.sort_order)) + 1 : 0
    const { data, error } = await supabase
      .from('stages')
      .insert({ ...stage, sort_order: maxOrder })
      .select()
      .single()
    if (!error && data) {
      setStages([...stages, data])
      return data
    }
    return null
  }

  const updateStage = async (id, updates) => {
    const { data, error } = await supabase
      .from('stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      setStages(stages.map(s => s.id === id ? data : s))
      return data
    }
    return null
  }

  const deleteStage = async (id) => {
    const { error } = await supabase.from('stages').delete().eq('id', id)
    if (!error) {
      setStages(stages.filter(s => s.id !== id))
    }
  }

  const reorderStages = async (newStages) => {
    setStages(newStages)
    const updates = newStages.map((s, i) => ({ id: s.id, sort_order: i }))
    await Promise.all(updates.map(u => supabase.from('stages').update({ sort_order: u.sort_order }).eq('id', u.id)))
  }

  return { stages, loading, createStage, updateStage, deleteStage, reorderStages, fetchStages }
}
