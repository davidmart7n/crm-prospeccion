import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useNotes(leadId) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotes = async () => {
    if (!leadId) return
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setNotes(data)
    }
    setLoading(false)
  }

  const createNote = async (note) => {
    setError(null)
    const { data, error: insertError } = await supabase
      .from('notes')
      .insert({ ...note, lead_id: leadId })
      .select()
      .single()
    if (insertError) {
      setError(insertError.message)
      return null
    }
    if (data) {
      setNotes(prev => [data, ...prev])
      return data
    }
    return null
  }

  const updateNote = async (id, updates) => {
    setError(null)
    const { data, error: updateError } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (updateError) {
      setError(updateError.message)
      return null
    }
    if (data) {
      setNotes(prev => prev.map(n => n.id === id ? data : n))
      return data
    }
    return null
  }

  const deleteNote = async (id) => {
    setError(null)
    const { error: deleteError } = await supabase.from('notes').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  useEffect(() => {
    if (leadId) {
      setNotes([])
      fetchNotes()
    }
  }, [leadId])

  return { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote }
}